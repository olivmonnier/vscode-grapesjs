import { typeBlockCode } from './config';

export default (editor, opts = {}) => {
  const bm = editor.BlockManager;
  const { blockCustomCode, blockLabel } = opts;

  blockCustomCode &&
    bm.add(typeBlockCode, {
      label: blockLabel,
      attributes: { class: 'fa fa-code' },
      category: 'Extra',
      activate: true,
      select: true,
      content: { type: typeBlockCode },
      ...blockCustomCode
    });
};
