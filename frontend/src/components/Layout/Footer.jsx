const Footer = () => {
  return (
    <footer className="flex h-12 items-center justify-center border-t bg-white antialiased shadow">
      <p className="mb-4 text-sm sm:mb-0">
        Developed By{' '}
        <a
          href="https://bharmalsystems.com/"
          className="cursor-pointer font-semibold italic text-primary hover:underline"
          target="_blank"
        >
          Bharmal System Designers
        </a>{' '}
        &copy; 2006-{new Date().getFullYear()}
      </p>
    </footer>
  );
};
export default Footer;
