import { resolve } from "path";
import { promises as fs } from "fs";
import type { Plugin, Manifest } from "vite";

export interface Options {
  /**
   * Array of paths of the manifest files that should be read and modified with the
   * query param, relative to `outDir`.
   */
  manifestPaths?: string[];
  /**
   * Name to use for the query param.
   */
  queryParamName?: string;
  /**
   * Value to use for the query param.
   */
  queryParamValue?: string | number;
}

export default function manifestQueryParam(options: Options = {}): Plugin {
  const {
    manifestPaths = [
      ".vite/manifest.json",
      ".vite/manifest-assets.json",
      "manifest.json",
      "manifest-assets.json",
    ],
    queryParamName = 'v',
    queryParamValue = Date.now(),
  } = options;

  return {
    name: "vite-plugin-query-hash",
    apply: "build",
    enforce: "post",
    async writeBundle({ dir }) {
      await Promise.all(
        manifestPaths.map((path) => appendQueryParamToManifest(path, dir!, queryParamName, queryParamValue))
      );
    },
  };
}

async function appendQueryParamToManifest(
  manifestPath: string,
  outDir: string,
  queryParamName: string,
  queryParamValue: string | number
) {
  const resolveInOutDir = (path: string) => resolve(outDir, path);
  manifestPath = resolveInOutDir(manifestPath);

  const manifest: Manifest | undefined = await fs
    .readFile(manifestPath, "utf-8")
    .then(JSON.parse, () => undefined);

  if (manifest) {
    Object.values(manifest).forEach((chunk) => {
      const queryParam = `?${queryParamName}=${queryParamValue}`;
      chunk.file += queryParam;
    });
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  }
}
