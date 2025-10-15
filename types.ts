
import type { FC, SVGProps } from 'react';

export interface EditorTool {
  id: string;
  name: string;
  description: string;
  icon: FC<SVGProps<SVGSVGElement>>;
  prompt: string;
  category: 'Style' | 'Enhancement' | 'Background';
}

export interface ImageData {
  base64: string;
  mimeType: string;
  url: string;
}
