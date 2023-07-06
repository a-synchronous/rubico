# Contributing

## Steps to release

```
# bump the repo version
npm version patch|minor|major

# run the build script
./build

# test the distribution
node dist-test.js

# commit the changes
git commit -m "distribute"

# publish the new version
npm publish
```
