const Footer = () => {
  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 John Doe. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with passion & creativity
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
