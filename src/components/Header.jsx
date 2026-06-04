import ProfileDropdown from "./ProfileDropdown";

export default function Header({ title }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Título de la Vista */}
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">
              {title}
            </h1>
          </div>

          {/* Controles derechos (Perfil / Cerrar Sesión) */}
          <div className="flex items-center gap-4">
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}
