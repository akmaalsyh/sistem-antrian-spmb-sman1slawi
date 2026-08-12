export default function ApplicationLogo(props) {
    return (
        <img 
            src="/logo-smansawi-asli.png" 
            alt="Logo Resmi SMAN 1 Slawi" 
            {...props}
            className={`${props.className || 'w-12 h-12'} object-contain`} 
        />
    );
}
