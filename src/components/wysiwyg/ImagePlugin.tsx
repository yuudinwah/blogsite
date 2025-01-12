import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNodeByKey, $insertNodes } from 'lexical';
import { useEffect } from 'react';
import { ImageNode, $createImageNode } from './ImageNode';
import { INSERT_IMAGE_COMMAND, IMAGE_ALIGN_COMMAND } from './ImageCommands';

export default function ImagePlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagePlugin: ImageNode not registered on editor');
    }

    return editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        const imageNode = $createImageNode(payload);
        $insertNodes([imageNode]);
        return true;
      },
      0
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      IMAGE_ALIGN_COMMAND,
      (payload) => {
        const { alignment, nodeKey } = payload;
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if (node instanceof ImageNode) {
            node?.setAlignment(alignment);
          }
        });
        return true;
      },
      0
    );
  }, [editor]);

  return null;
}
