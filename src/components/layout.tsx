const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full bg-background">
      <main>{children}</main>
    </div>
  );
};

export default Layout;
