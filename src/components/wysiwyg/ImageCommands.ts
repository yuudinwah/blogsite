import { createCommand } from 'lexical';

export type InsertImagePayload = {
  src: string;
  altText: string;
  width?: string;
  height?: string;
  alignment?: 'left' | 'center' | 'right';
};

export type ImageAlignPayload = {
  alignment: 'left' | 'center' | 'right';
  nodeKey: string;
};

export const INSERT_IMAGE_COMMAND = createCommand<InsertImagePayload>('INSERT_IMAGE');
export const IMAGE_ALIGN_COMMAND = createCommand<ImageAlignPayload>('IMAGE_ALIGN');
