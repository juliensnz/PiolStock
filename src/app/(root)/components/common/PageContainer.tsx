const PageContainer = ({children}: {children: React.ReactNode}) => {
  return <div className="relative flex h-full w-screen flex-col">{children}</div>;
};

export {PageContainer};
