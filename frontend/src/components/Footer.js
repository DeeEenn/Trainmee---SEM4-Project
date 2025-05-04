const Footer = () => {
    return (
        <footer className=" text-black shadow-lg py-4">
            <div className="container border-1 mx-auto px-4">
                <p className="text-center text-sm font-montserrat">
                    &copy; {new Date().getFullYear()} DAVID NIČ. FIM UHK Studentský zápočtový projekt TNPW2/PRO2
                </p>    
            </div>
        </footer>
    )
}

export default Footer;