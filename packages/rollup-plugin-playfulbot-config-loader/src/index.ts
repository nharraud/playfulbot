// import fs from 'fs';

// const rawConfig = fs.readFileSync('playfulbot-config.json');
// const config = JSON.parse(rawConfig.toString());

// let imports = '';
// let exports = '';
// for (const [key, value] of Object.entries(config)) {
//   imports += `import ${key} from '${value}';\n`;
//   exports += `  ${key},\n`;
// }
// const result = `
// ${imports}
// export default {
// ${exports}
// };
// `

export default function virtualModule () {
  return {
    name: 'rollup-plugin-playfulbot-config-loader', // this name will show up in warnings and errors
    resolveId ( source: string ) {
      if (source === 'playfulbot-config') {
        return source; // this signals that rollup should not ask other plugins or check the file system to find this id
      }
      return null; // other ids should be handled as usually
    },
    load ( id: string ) {
      if (id === 'playfulbot-config') {
        // return result;

        return `
        import { gameDefinition } from 'playfulbot-wallrace';

        export { gameDefinition };
        `;
      }
      return null; // other ids should be handled as usually
    }
  };
}
