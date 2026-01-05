'use client';

export default function AdminFooter() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-white mb-2">Admin Panel</h3>
            <p className="text-sm">
              Ratala Architecture & Interiors
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Secure Admin Management System
            </p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm">
              © 2024 Ratala Architecture. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Protected access only
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
