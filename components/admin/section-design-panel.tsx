'use client';

import { ReactNode } from 'react';

interface SectionDesignPanelProps {
  title?: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  sectionId?: string;
  designConfig?: any;
  onChange?: (design: any) => void;
}

export function SectionDesignPanel({ 
  title, 
  description, 
  children, 
  actions 
}: SectionDesignPanelProps) {
  return (
    <div className="space-y-4">
      {(title || description || actions) && (
        <div className="flex items-start justify-between border-b border-gray-200 pb-4">
          <div>
            {title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
            {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
