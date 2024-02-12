<h2 align='center'>
  <samp>vite-plugin-query-hash</samp>
</h2>

[Vite]: https://vitejs.dev/

## Why

Vite does not offer an inbuilt solution to add cache busting params to the generated build assets. (https://github.com/vitejs/vite/issues/5825).

By default vite adds a hash to the file name for cache busting which can be problematic if you're deploying the assets to multiple servers in async and would like the old version of the asset to remain accessible.

This plugin extends `manifest.json` and adds a configurable query param to each `file` entry for each generated asset.

I built and tested this mostly for my own deployment use cases.

## Installation & Usage

Install the package as a development dependency:

```bash
npm i -D vite-plugin-query-hash
```

Add it to your vite plugin list:

````ts
import { defineConfig } from 'vite'
import queryHash from 'vite-plugin-query-hash'

export default defineConfig({
  plugins: [
    queryHash(),
  ],
})
````

The [`build.manifest`](https://vitejs.dev/config/#build-manifest) option must be enabled in order to generate a `manifest.json` file. This option is enabled by default in most configurations.

You must also disable default vite filename hashing via the [`build.rollupOptions`](https://vitejs.dev/config/build-options.html#build-rollupoptions) configuration:

````ts
build: {
  rollupOptions: {
    output: {
      entryFileNames: `assets/[name].js`,
      chunkFileNames: `assets/[name].js`,
      assetFileNames: `assets/[name].[ext]`,
    },
  },
}
````

## Configuration

The following options can be provided:

- <kbd>queryParamName</kbd>

  Name to use for the query param

  __Default:__ `v`

  ```ts
  queryHash({ hashParamName: 'customParam' })
  ```

- <kbd>queryParamValue</kbd>

  Value to use for the query param value.

  __Default:__ `Date.now()`

  ```ts
  queryHash({ hashParamValue: BUILD_VERSION })
  ```

- <kbd>manifestPaths</kbd>

  Manifest paths to use when adding the query param, relative to `outDir`. Use if you're outputting your manifests to a custom dir.

  __Default:__ `[
      '.vite/manifest.json',
      '.vite/manifest-assets.json',
      'manifest.json',
      'manifest-assets.json',
    ]`

  ```ts
  queryHash({ manifestPaths: ['custom/path/manifest.json', 'another/manifest.json'] })
  ```

## Acknowledgements

Repo structure and idea based on [`vite-plugin-manifest-sri`](https://github.com/ElMassimo/vite-plugin-manifest-sri)
