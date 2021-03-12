
warn if outside of
=======

A github action that posts a comment on the pull request if a pushed change set contains a file which is not supposed to be changed.

```yaml
on:
  pull_request:
    paths:
      - 'Projects/NewFeatureFramework/**'
    types:
      - synchronize
      - labeled
jobs:
  lendingkit:
    if: ${{ github.event.label.name == 'NewFeature' || contains(github.event.pull_request.labels.*.name, 'NewFeature') }}
    name: Warn non-NewFeature changes
    env:
      GITHUB_TOKEN: ${{ secrets.GH_API_TOKEN }}
    runs-on: ubuntu-latest
    steps:
    - uses: ku/warn-if-outside-of
      with:
        if_contains: 'Projects/NewFeatureFramework'
        warns: '!Projects/NewFeatureFramework'
        except: 'README.md, Projects/*yaml'

```
