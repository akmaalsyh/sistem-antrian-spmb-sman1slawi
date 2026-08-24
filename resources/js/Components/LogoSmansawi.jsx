export default function LogoSmansawi({ className = "w-12 h-12" }) {
    return (
        <img 
            src="/logo-smansawi-asli.png?v=2" 
            alt="Logo Resmi SMAN 1 Slawi" 
            className={`${className} object-contain`} 
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/logo-smansawi.png?v=2';
            }}
        />
    );
}
