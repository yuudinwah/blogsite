import { EditorConfig, NodeKey, SerializedLexicalNode, Spread, ElementNode, DOMExportOutput } from 'lexical';
import { DecoratorNode } from 'lexical';
import { JSX } from 'react';

export interface ImagePayload {
    src: string;
    altText: string;
    width?: string;
    height?: string;
    alignment?: 'left' | 'center' | 'right';
}

export type SerializedImageNode = Spread<
    {
        src: string;
        altText: string;
        width?: string;
        height?: string;
        alignment?: 'left' | 'center' | 'right';
    },
    SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
    __src: string;
    __altText: string;
    __width: string;
    __height: string;
    __alignment: 'left' | 'center' | 'right';

    static getType(): string {
        return 'image';
    }

    static clone(node: ImageNode): ImageNode {
        return new ImageNode(
            node.__src,
            node.__altText,
            node.__width,
            node.__height,
            node.__alignment,
            node.__key
        );
    }

    constructor(
        src: string,
        altText: string,
        width?: string,
        height?: string,
        alignment?: 'left' | 'center' | 'right',
        key?: NodeKey
    ) {
        super(key);
        this.__src = src;
        this.__altText = altText;
        this.__width = width || 'auto';
        this.__height = height || 'auto';
        this.__alignment = alignment || 'left';
    }

    createDOM(config: EditorConfig): HTMLElement {
        const div = document.createElement('div');
        div.className = `image-container ${this.__alignment}`;
        return div;
    }

    updateDOM(): false {
        return false;
    }

    setAlignment(alignment: 'left' | 'center' | 'right'): void {
        const writable = this.getWritable();
        writable.__alignment = alignment;
    }

    getAlignment(): string {
        return this.__alignment;
    }

    decorate(): JSX.Element {
        const alignment = this.__alignment;
        const containerStyle: React.CSSProperties = {
            display: 'flex',
            justifyContent:
                alignment === 'center' ? 'center' :
                    alignment === 'right' ? 'flex-end' : 'flex-start',
            margin: '1em 0',
            position: 'relative',
        };

        const imageStyle: React.CSSProperties = {
            maxWidth: '100%',
            height: 'auto',
        };

        return (
            <div style={containerStyle} contentEditable={false}>
                <img
                    src={this.__src}
                    alt={this.__altText}
                    style={imageStyle}
                    width={this.__width}
                    height={this.__height}
                    className="rounded"
                    draggable="false"
                />
            </div>
        );
    }

    exportJSON(): SerializedImageNode {
        return {
            type: 'image',
            src: this.__src,
            altText: this.__altText,
            width: this.__width,
            height: this.__height,
            alignment: this.__alignment,
            version: 1,
        };
    }

    exportDOM(): DOMExportOutput {
        const img = document.createElement('img');
        img.setAttribute('src', this.__src);
        img.setAttribute('alt', this.__altText);
        img.setAttribute('class', 'editor-image');

        // Tambahkan inline styles
        img.style.maxWidth = '100%';
        img.style.height = 'auto';

        if (this.__alignment === 'center') {
            img.style.display = 'block';
            img.style.marginLeft = 'auto';
            img.style.marginRight = 'auto';
        } else if (this.__alignment === 'left') {
            img.style.float = 'left';
            img.style.marginRight = '1em';
        } else if (this.__alignment === 'right') {
            img.style.float = 'right';
            img.style.marginLeft = '1em';
        }

        return { element: img };
    }

    exportHTML(): string {
        return `<img 
          src="${this.__src}" 
          alt="${this.__altText}" 
          class="editor-image" 
          style="max-width:100%;height:auto;${this.__alignment === 'center'
                ? 'display:block;margin-left:auto;margin-right:auto;'
                : this.__alignment === 'left'
                    ? 'float:left;margin-right:1em;'
                    : this.__alignment === 'right'
                        ? 'float:right;margin-left:1em;'
                        : ''
            }"
        />`;
    }


    static importJSON(serializedNode: SerializedImageNode): ImageNode {
        return $createImageNode({
            src: serializedNode.src,
            altText: serializedNode.altText,
            width: serializedNode.width,
            height: serializedNode.height,
            alignment: serializedNode.alignment,
        });
    }
}

export function $createImageNode({
    src,
    altText,
    width,
    height,
    alignment = 'center',
}: ImagePayload): ImageNode {
    return new ImageNode(src, altText, width, height, alignment);
}

export function $isImageNode(node: any): node is ImageNode {
    return node instanceof ImageNode;
}