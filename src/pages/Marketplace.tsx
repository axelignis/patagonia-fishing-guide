import React, { useState } from 'react';
import { ShoppingCart, Filter, Star, Package, Truck, CreditCard } from 'lucide-react';
import { NavigationButton } from '../components/NavigationButton';
import productsData from '../data/products.json';
import { Product } from '../types';

const Marketplace: React.FC = () => {
  const [products] = useState<Product[]>(productsData as unknown as Product[]);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [showCart, setShowCart] = useState(false);

  const categories = [
    { value: 'todos', label: 'Todos los productos' },
    { value: 'señuelos', label: 'Señuelos' },
    { value: 'multifilamentos', label: 'Líneas y Multifilamentos' },
    { value: 'cañas', label: 'Cañas de Pescar' },
    { value: 'accesorios', label: 'Accesorios' }
  ];

  const filteredProducts = selectedCategory === 'todos' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <NavigationButton 
              to="/" 
              label="Volver al inicio" 
              className="inline-flex items-center text-slate-300 hover:text-white transition-colors mb-8"
            />
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Marketplace de Pesca
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Todo el equipamiento que necesitas para tu aventura de pesca en la Patagonia chilena. 
              Productos de calidad seleccionados por nuestros guías expertos.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Cart Button */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setShowCart(!showCart)}
            className="bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700 transition-colors relative"
          >
            <ShoppingCart className="w-6 h-6" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>

        {/* Cart Sidebar */}
        {showCart && (
          <div className="fixed inset-0 z-40 overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCart(false)} />
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform p-6">
              <h2 className="text-2xl font-bold mb-4">Carrito de Compras</h2>
              {cart.length === 0 ? (
                <p className="text-gray-500">Tu carrito está vacío</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.product.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/placeholder-product.jpg';
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{item.product.name}</h4>
                          <p className="text-gray-600 text-sm">
                            ${item.product.price.toLocaleString()} x {item.quantity}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-lg">Total:</span>
                      <span className="font-bold text-lg text-emerald-600">
                        ${getTotalPrice().toLocaleString()}
                      </span>
                    </div>
                    <button className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors">
                      Proceder al Pago
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 mr-2 text-gray-600" />
            <h2 className="text-lg font-semibold">Filtrar por categoría</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              {/* Product Image */}
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder-product.jpg';
                  }}
                />
                {product.featured && (
                  <div className="absolute top-2 left-2 bg-emerald-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    Destacado
                  </div>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold">Sin Stock</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full uppercase tracking-wide font-semibold">
                    {product.category}
                  </span>
                </div>
                
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>

                {/* Specifications Preview */}
                {product.specifications && (
                  <div className="mb-3">
                    <div className="text-xs text-gray-500">
                      {Object.entries(product.specifications).slice(0, 2).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key}:</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-emerald-600">
                    ${product.price.toLocaleString()}
                  </span>
                  
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      product.inStock
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {product.inStock ? 'Agregar' : 'Sin Stock'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No hay productos en esta categoría
            </h3>
            <p className="text-gray-500">
              Intenta seleccionar una categoría diferente
            </p>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">
            ¿Por qué comprar con nosotros?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Productos Auténticos</h3>
              <p className="text-gray-600">
                Equipamiento seleccionado y probado por nuestros guías expertos en aguas patagónicas
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Envío Gratis</h3>
              <p className="text-gray-600">
                Envío gratuito a toda Chile en compras superiores a $50.000
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pago Seguro</h3>
              <p className="text-gray-600">
                Múltiples métodos de pago seguros incluyendo WebPay Chile
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
