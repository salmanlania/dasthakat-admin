const Footer = () => {
  return (
    <footer className="border-t h-12 bg-white flex items-center justify-center  antialiased shadow">
      <p className="mb-4 text-sm sm:mb-0">
        Developed By{" "}
        <a
          href="https://bharmalsystems.com/"
          className="font-semibold italic text-primary hover:underline cursor-pointer"
          target="_blank"
        >
          Bharmal System Designers
        </a>{" "}
        &copy; 2006-{new Date().getFullYear()}
      </p>
    </footer>
  );
};
export default Footer;
