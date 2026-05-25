import type React from 'react';

interface PageWindowProps {
  headerActionButtons?: React.ReactNode;
  children: React.ReactNode;
  title?: string;
  tabs?: React.ReactNode;
}

const PageWindow = ({ headerActionButtons, children, title, tabs }: PageWindowProps) => {
  return (
    <div className="h-[99%] w-full">
      <div
        className="bg-white rounded-xl shadow-md flex flex-col h-full 
                   overflow-hidden border border-gray-200"
      >
        <div
          className="px-8 py-5 flex items-center flex-shrink-0 
                     bg-gradient-to-r from-gray-50 to-gray-100 
                     border-b border-gray-200"
        >
          <div className="flex items-center space-x-3">
            <div className="w-1 h-6 bg-green-900 rounded-full" />

            {title && (
              <h2
                className="text-lg font-semibold text-gray-900 
                           tracking-tight"
              >
                {title}
              </h2>
            )}
          </div>
        </div>

        <div
          className="h-0.5 bg-gradient-to-r from-green-900 
                       via-amber-500 to-transparent"
        />

        {(tabs || headerActionButtons) && (
          <div
            className="px-8 flex items-center justify-between 
                       flex-shrink-0 border-b border-gray-200 bg-white"
          >
            <div className="flex items-center">{tabs}</div>

            {headerActionButtons && <div className="flex-shrink-0 py-2">{headerActionButtons}</div>}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-8 bg-white">
          <div className="max-w-full space-y-8">{children}</div>
        </div>

        <div
          className="px-8 py-4 border-t border-gray-200 
                     bg-gray-50 text-xs text-gray-600 
                     flex justify-between items-center"
        >
          <span>Ready</span>
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-900 rounded-full" />
              <span>Connected</span>
            </span>
            <span className="text-gray-400">v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageWindow;
