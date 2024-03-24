import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Retrieve the current file's directory name, as `__dirname` would. In ESM modules __dirname is not available.
 * Call this function as follow: `getDirName(import.meta.url)`
 * @param moduleUrl should be `import.meta.url`
 * @returns the current file's directory name
 */
const getDirName = function (moduleUrl: string) {
    const filename = fileURLToPath(moduleUrl)
    return path.dirname(filename)
}

export {
    getDirName
}