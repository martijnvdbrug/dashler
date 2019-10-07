import shortid = require('shortid');

/**
 * Creates a ID safe shortId + the given name
 */
export function readableId(name: string): string {
  const id = shortid.generate();
  if (!name) {
    return id;
  }
  name = name.replace(/ +(?= )/g, '');
  name = name.replace(new RegExp('/', 'g'), '');
  name = name.trim();
  name = name.replace(new RegExp(' ', 'g'), '-');
  name = escape(name);
  return `${id}-${name}`;
}
