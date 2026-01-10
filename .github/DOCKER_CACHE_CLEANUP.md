# Docker Build Cache Management (Self-Hosted + Harbor)

## Problem Statement

The previous workflow used separate buildcache tag with `type=registry,mode=max` which caused continuous storage growth because:

1. **Accumulation without cleanup**: Each build created new cache layers in Harbor without removing old ones
2. **`mode=max` overhead**: Exported all intermediate layers consuming maximum storage
3. **Separate cache artifact**: `:buildcache` tag created additional storage overhead

## Implemented Solution

Switched to **inline cache** strategy - cache metadata embedded directly in the `:develop` tag:

### Benefits

- ✅ **No separate cache artifacts**: Cache lives in the image itself
- ✅ **Automatic cleanup**: Old `:develop` images are overwritten on each build
- ✅ **Fast for self-hosted runners**: Cache pulled from local network Harbor (not internet)
- ✅ **Zero storage bloat**: Only keeps cache for the current image
- ✅ **Simpler**: No separate cache management needed

### How It Works

```yaml
# Pull cache from the develop image itself
cache-from: type=registry,ref=${{ env.HARBOR_REGISTRY }}/${{ env.HARBOR_PROJECT }}/${{ env.IMAGE_NAME }}:develop

# Embed cache metadata directly into the pushed image
cache-to: type=inline
```

**Trade-off**: Inline cache is slightly less efficient than `mode=max` external cache (caches fewer layers), but for self-hosted runners on the same network as Harbor, the network speed gain outweighs the cache efficiency loss.

## Why Not GitHub Actions Cache?

GitHub Actions cache would require:

- ❌ Downloading cache from GitHub's servers over internet (slow for self-hosted)
- ❌ Additional bandwidth costs
- ❌ Limited to 10GB per repo

Harbor registry cache is faster because it's on your local network.

## Alternative Solutions

### Option A: External Cache with Cleanup Job (Most Cache Hits)

If you need maximum cache efficiency, use external cache + cleanup:

```yaml
jobs:
  build-and-push:
    steps:
      # ... existing steps ...

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ${{ env.HARBOR_REGISTRY }}/${{ env.HARBOR_PROJECT }}/${{ env.IMAGE_NAME }}:develop
            ${{ env.HARBOR_REGISTRY }}/${{ env.HARBOR_PROJECT }}/${{ env.IMAGE_NAME }}:develop-${{ env.BUILD_NUMBER }}
          cache-from: type=registry,ref=${{ env.HARBOR_REGISTRY }}/${{ env.HARBOR_PROJECT }}/${{ env.IMAGE_NAME }}:buildcache
          cache-to: type=registry,ref=${{ env.HARBOR_REGISTRY }}/${{ env.HARBOR_PROJECT }}/${{ env.IMAGE_NAME }}:buildcache,mode=max

  cleanup-cache:
    runs-on: [self-hosted, minhdqdev-org, manual]
    needs: build-and-push
    if: always()
    steps:
      - name: Prune old cache layers
        env:
          HARBOR_USERNAME: ${{ secrets.HARBOR_USERNAME }}
          HARBOR_PASSWORD: ${{ secrets.HARBOR_PASSWORD }}
        run: |
          # Delete and recreate buildcache to remove accumulated layers
          curl -X DELETE \
            -u "$HARBOR_USERNAME:$HARBOR_PASSWORD" \
            "https://${{ env.HARBOR_REGISTRY }}/api/v2.0/projects/${{ env.HARBOR_PROJECT }}/repositories/${{ env.IMAGE_NAME }}/artifacts/buildcache" \
            || echo "No buildcache to delete"
```

### Option B: Use mode=min Instead of mode=max

Reduces cache layers exported (less storage overhead, slightly slower builds):

```yaml
cache-to: type=registry,ref=...:buildcache,mode=min
```

### Option C: Time-based Cache Tags

Rotate cache weekly to prevent indefinite growth:

```yaml
cache-from: type=registry,ref=${{ env.HARBOR_REGISTRY }}/${{ env.HARBOR_PROJECT }}/${{ env.IMAGE_NAME }}:buildcache-${{ github.run_number / 50 }}
cache-to: type=registry,ref=${{ env.HARBOR_REGISTRY }}/${{ env.HARBOR_PROJECT }}/${{ env.IMAGE_NAME }}:buildcache-${{ github.run_number / 50 }},mode=max
```

This creates a new cache every ~50 builds, old ones can be cleaned up with Harbor retention policy.

## Configure Harbor Retention Policy (Recommended)

Set up automated cleanup for all cache-related tags:

1. Navigate to: Harbor → Projects → minhdqdev → Repositories → minhdqdev-website
2. Tag Retention → Add Rule:
   - **Tag filter**: `develop-*` (build number tags)
   - **Retain**: Most recently pushed 10 artifacts
   - **Schedule**: Daily at 2 AM UTC

This keeps your 10 most recent build-numbered images and removes old ones.

## Performance Comparison

| Cache Strategy    | Storage Growth | Network Speed (self-hosted) | Cache Hit Rate |
| ----------------- | -------------- | --------------------------- | -------------- |
| Inline (current)  | ✅ None        | ✅ Fast (local Harbor)      | ⚠️ Good (~80%) |
| External mode=max | ❌ High        | ✅ Fast (local Harbor)      | ✅ Best (~95%) |
| GitHub Actions    | ✅ Low         | ❌ Slow (internet)          | ✅ Best (~95%) |
| External mode=min | ⚠️ Medium      | ✅ Fast (local Harbor)      | ⚠️ Good (~85%) |

## Monitoring

## Cleanup of Existing Cache Blobs

To clean up already accumulated buildcache in Harbor:

```bash
# Option 1: Via Harbor API
curl -X DELETE -u "username:password" \
  "https://harbor.minhdq.dev/api/v2.0/projects/minhdqdev/repositories/minhdqdev-website/artifacts/buildcache"

# Option 2: Via Docker CLI
docker manifest inspect harbor.minhdq.dev/minhdqdev/minhdqdev-website:buildcache && \
  curl -X DELETE -u "user:pass" \
    "https://harbor.minhdq.dev/api/v2.0/projects/minhdqdev/repositories/minhdqdev-website/artifacts/buildcache"
```

Then run garbage collection in Harbor:

1. Harbor Admin → Configuration → Garbage Collection → GC Now
2. Or schedule automatic GC daily

## Monitoring

### Check cache effectiveness:

```bash
# Check build times before/after
gh run list --workflow=ci-dev.yml --limit 10

# Check Harbor storage usage
curl -u "user:pass" \
  "https://harbor.minhdq.dev/api/v2.0/projects/minhdqdev/summary" \
  | jq '.repo_count, .quota.used.storage'

# View specific artifact sizes
curl -u "user:pass" \
  "https://harbor.minhdq.dev/api/v2.0/projects/minhdqdev/repositories/minhdqdev-website/artifacts" \
  | jq '.[] | {tags: .tags[].name, size: .size}'
```

### Monitor build cache hits:

Look for these in build logs:

```
#8 importing cache manifest from harbor.minhdq.dev/minhdqdev/minhdqdev-website:develop
#8 CACHED
```

## Recommendations

1. **Current solution (inline cache)** is best for your self-hosted + Harbor setup
2. Monitor first few builds - if build times increase significantly, consider Option A
3. Set up Harbor retention policy to clean `develop-*` numbered tags
4. Schedule Harbor garbage collection weekly
5. If you need maximum cache efficiency, use Option A (external cache + cleanup job)

## References

- [Docker Buildx cache backends](https://docs.docker.com/build/cache/backends/)
- [Inline cache documentation](https://docs.docker.com/build/cache/backends/inline/)
- [Harbor API reference](https://goharbor.io/docs/latest/working-with-projects/working-with-images/managing-images/)

1. **Current solution (GitHub Actions cache)** is best for most use cases
2. Monitor self-hosted runner disk space: `/tmp/.buildx-cache` can grow to ~500MB-2GB
3. If you exceed GitHub's 10GB cache limit, consider Option A (registry + cleanup)
4. Set up Harbor retention policies regardless (good housekeeping)

## References

- [Docker Buildx cache backends](https://docs.docker.com/build/cache/backends/)
- [GitHub Actions cache limits](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows#usage-limits-and-eviction-policy)
- [Harbor retention policy](https://goharbor.io/docs/latest/working-with-projects/working-with-images/create-tag-retention-rules/)
