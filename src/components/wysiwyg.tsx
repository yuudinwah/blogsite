'use client'

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { useEffect, useState } from 'react';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  $createParagraphNode,
  TextFormatType,
  FORMAT_ELEMENT_COMMAND,
  ElementFormatType,
  $createTextNode,
  TextNode,
  $isTextNode,
  ParagraphNode,
  $getRoot
} from 'lexical';
import {
  $createHeadingNode,
  HeadingNode,
} from '@lexical/rich-text';
import { $createCodeNode, CodeHighlightNode, CodeNode } from '@lexical/code';
import { $isLinkNode, LinkNode, TOGGLE_LINK_COMMAND, AutoLinkNode, $createLinkNode } from '@lexical/link';
import { $findMatchingParent } from '@lexical/utils';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListItemNode, ListNode } from '@lexical/list';
import { MarkNode } from '@lexical/mark';
import { $isImageNode, ImageNode } from './wysiwyg/ImageNode';
import ImagePlugin from './wysiwyg/ImagePlugin';
import { IMAGE_ALIGN_COMMAND, INSERT_IMAGE_COMMAND } from './wysiwyg/ImageCommands';

// Define custom type for heading tags
type HeadingTag = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const formatText = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatAlign = (align: ElementFormatType) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, align);
  };

  const formatFontSize = (tag: HeadingTag) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const nodes = selection.getNodes();

      nodes.forEach((node) => {
        const parent = node.getParent();
        if (!parent) return;

        let newNode;
        const textContent = node.getTextContent();

        if (tag === 'p') {
          newNode = $createParagraphNode();
        } else {
          newNode = $createHeadingNode(tag);
        }

        // Periksa format hanya jika node adalah TextNode
        if ($isTextNode(node)) {
          const textNode = node as TextNode;
          const format = textNode.getFormat();

          const newTextNode = $createTextNode(textContent);
          // Terapkan format yang sama ke node baru
          newTextNode.setFormat(format);
          newNode.append(newTextNode);
        } else {
          // Jika bukan TextNode, append text content saja
          const newTextNode = $createTextNode(textContent);
          newNode.append(newTextNode);
        }

        if (parent.is(node)) {
          parent.replace(newNode);
        } else {
          node.replace(newNode);
        }
      });
    });
  };

  const insertCodeBlock = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const codeNode = $createCodeNode();
        const textContent = selection.getTextContent();
        const textNode = $createTextNode(textContent);
        codeNode.append(textNode);
        selection.insertNodes([codeNode]);
      }
    });
  };

  const insertLink = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const url = prompt('Enter URL:', '');
      if (!url) return;

      const linkNode = $createLinkNode(url);
      const textContent = selection.getTextContent();
      const textNode = $createTextNode(textContent);
      linkNode.append(textNode);
      selection.insertNodes([linkNode]);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Untuk testing, gunakan URL.createObjectURL
        const url = URL.createObjectURL(file);

        // Untuk production, upload ke server:
        // const formData = new FormData();
        // formData.append('image', file);
        // const response = await fetch('/api/upload', {
        //   method: 'POST',
        //   body: formData,
        // });
        // const data = await response.json();
        // const url = data.url;

        editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
          src: url,
          altText: file.name,
        });
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const [isLink, setIsLink] = useState(false);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const node = selection.anchor.getNode();
          if ($isImageNode(node)) {
            setSelectedImage(node.getKey());
          } else {
            setSelectedImage(null);
          }
        }
      });
    });
  }, [editor]);

  const alignImage = (alignment: 'left' | 'center' | 'right') => {
    if (selectedImage) {
      editor.dispatchCommand(IMAGE_ALIGN_COMMAND, {
        alignment,
        nodeKey: selectedImage,
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 border-b border-gray-200">
      {/* Font Size */}
      <select
        onChange={(e) => formatFontSize(e.target.value as HeadingTag)}
        className="px-3 py-1.5 border rounded hover:bg-gray-50"
      >
        <option value="p">Normal</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
      </select>

      {/* Basic Formatting */}
      <div className="flex gap-1">
        <button
          onClick={() => formatText('bold')}
          className="p-2 hover:bg-gray-100 rounded text-gray-700"
        >
          B
        </button>
        <button
          onClick={() => formatText('italic')}
          className="p-2 hover:bg-gray-100 rounded text-gray-700 italic"
        >
          I
        </button>
        <button
          onClick={() => formatText('underline')}
          className="p-2 hover:bg-gray-100 rounded text-gray-700 underline"
        >
          U
        </button>
      </div>
      <div className="h-6 w-px bg-gray-200" />

      {/* Text Alignment */}
      <div className="flex gap-1">
        <button
          onClick={() => formatAlign('left')}
          className="p-2 hover:bg-gray-100 rounded text-gray-700"
        >
          Left
        </button>
        <button
          onClick={() => formatAlign('center')}
          className="p-2 hover:bg-gray-100 rounded text-gray-700"
        >
          Center
        </button>
        <button
          onClick={() => formatAlign('right')}
          className="p-2 hover:bg-gray-100 rounded text-gray-700"
        >
          Right
        </button>
        <button
          onClick={() => formatAlign('justify')}
          className="p-2 hover:bg-gray-100 rounded text-gray-700"
        >
          Justify
        </button>
      </div>
      <div className="h-6 w-px bg-gray-200" />

      {/* Tombol Code Block dan Link */}
      <div className="flex gap-1">
        <button
          onClick={insertCodeBlock}
          className="p-2 hover:bg-gray-100 rounded text-gray-700"
          title="Insert Code Block"
        >
          Code
        </button>

        <button
          onClick={insertLink}
          className={`p-2 hover:bg-gray-100 rounded ${isLink ? 'text-blue-500' : 'text-gray-700'
            }`}
          title="Insert Link"
        >
          Link
        </button>
      </div>
      <div className="flex gap-1">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="p-2 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
          title="Upload Image"
        >
          Image
        </label>
      </div>
      {selectedImage && (
        <div className="flex gap-1">
          <button
            onClick={() => alignImage('left')}
            className="p-2 hover:bg-gray-100 rounded text-gray-700"
          >
            Left
          </button>
          <button
            onClick={() => alignImage('center')}
            className="p-2 hover:bg-gray-100 rounded text-gray-700"
          >
            Center
          </button>
          <button
            onClick={() => alignImage('right')}
            className="p-2 hover:bg-gray-100 rounded text-gray-700"
          >
            Right
          </button>
        </div>
      )}

    </div >
  );
}

function InitialContentPlugin({ initialContent }: { initialContent?: string }) {
  const [editor] = useLexicalComposerContext();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (initialContent && !isInitialized) {
      editor.update(() => {
        const root = $getRoot();
        const parser = new DOMParser();
        const dom = parser.parseFromString(initialContent, 'text/html');
        
        // Clear existing content
        root.clear();
        
        // Import content from HTML
        const nodes = $generateNodesFromDOM(editor, dom);
        root.append(...nodes);
      });
      setIsInitialized(true);
    }
  }, [editor, initialContent, isInitialized]);

  return null;
}

export default function Editor({ 
  onChange, 
  initialContent 
}: { 
  onChange: (html: string) => void;
  initialContent?: string;
}) {
  const initialConfig = {
    namespace: 'MyEditor',
    onError: (error: Error) => console.error(error),
    nodes: [
      HeadingNode,
      ParagraphNode,
      TextNode,
      CodeNode,
      CodeHighlightNode,
      LinkNode,
      AutoLinkNode,
      ListNode,
      ListItemNode,
      MarkNode,
      ImageNode,
    ],
    theme: {
      paragraph: 'mb-2',
      text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
      },
      heading: {
        h1: 'text-4xl font-bold mb-4',
        h2: 'text-3xl font-bold mb-3',
        h3: 'text-2xl font-bold mb-2',
        h4: 'text-xl font-bold mb-2',

      },
      code: 'bg-gray-100 rounded-md p-2 font-mono text-sm block my-2',
      link: 'text-blue-500 underline cursor-pointer',
    },
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="h-full flex flex-col">
          <ToolbarPlugin />
          <div className="flex-1 overflow-auto">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="h-full w-full px-4 py-3 focus:outline-none"
                />
              }
              // placeholder={
              //   <div className="absolute top-[52px] left-4 text-gray-400 pointer-events-none">
              //     Type something...
              //   </div>
              // }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <LinkPlugin />
            <ImagePlugin />
            <OnChangePlugin onChange={onChange} />
            {initialContent && <InitialContentPlugin initialContent={initialContent} />}
          </div>
        </div>
      </LexicalComposer>
    </div>
  );
}

function OnChangePlugin({ onChange }: { onChange: (html: string) => void }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      editor.getEditorState().read(() => {
        // Langsung generate HTML untuk seluruh konten
        const html = $generateHtmlFromNodes(editor);
        onChange(html);
      });
    });
  }, [editor, onChange]);

  return null;
}