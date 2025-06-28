'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import ProductDetailModal from '@/components/products/ProductDetailModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Product, getProducts, SearchParams } from '@/lib/products';
import { 
  Search, 
  Filter, 
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronDown,
  X
} from 'lucide-react';

const CollectionsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
    filters: {
      category: [],
      priceRange: [0, 1000],
      condition: [],
      inStock: true,
    },
    sortBy: 'newest',
    page: 1,
    limit: 12,
  });

  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    loadProducts();
  }, [searchParams]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const result = await getProducts(searchParams);
      setProducts(result.products);
      setTotal(result.total);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchParams(prev => ({
      ...prev,
      query,
      page: 1,
    }));
  };

  const handleFilterChange = (filterType: string, value: any) => {
    setSearchParams(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [filterType]: value,
      },
      page: 1,
    }));
  };

  const handleSortChange = (sortBy: SearchParams['sortBy']) => {
    setSearchParams(prev => ({
      ...prev,
      sortBy,
      page: 1,
    }));
  };

  const toggleCategory = (category: string) => {
    const currentCategories = searchParams.filters?.category || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    
    handleFilterChange('category', newCategories);
  };

  const toggleCondition = (condition: string) => {
    const currentConditions = searchParams.filters?.condition || [];
    const newConditions = currentConditions.includes(condition)
      ? currentConditions.filter(c => c !== condition)
      : [...currentConditions, condition];
    
    handleFilterChange('condition', newConditions);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => 
      prev.includes(product.id)
        ? prev.filter(id => id !== product.id)
        : [...prev, product.id]
    );
  };

  const clearFilters = () => {
    setSearchParams(prev => ({
      ...prev,
      query: '',
      filters: {
        category: [],
        priceRange: [0, 1000],
        condition: [],
        inStock: true,
      },
      page: 1,
    }));
  };

  const categories = [
    { id: 'vintage', label: 'Vintage', count: 45 },
    { id: 'costume', label: 'Costume', count: 32 },
    { id: 'designer', label: 'Designer', count: 18 },
  ];

  const conditions = [
    { id: 'excellent', label: 'Excellent' },
    { id: 'very_good', label: 'Very Good' },
    { id: 'good', label: 'Good' },
    { id: 'fair', label: 'Fair' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  const activeFiltersCount = 
    (searchParams.filters?.category?.length || 0) +
    (searchParams.filters?.condition?.length || 0) +
    (searchParams.query ? 1 : 0);

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-deep-charcoal mb-4">
            Our Collections
          </h1>
          <p className="text-lg text-warm-gray max-w-2xl">
            Discover our curated selection of vintage, costume, and designer jewelry pieces. 
            Each item is carefully authenticated and described in detail.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="sticky top-20">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Filters</CardTitle>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-vintage-gold hover:text-vintage-gold/80"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-warm-gray" />
                    <Input
                      placeholder="Search jewelry..."
                      value={searchParams.query || ''}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Category</Label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={category.id}
                          checked={searchParams.filters?.category?.includes(category.id) || false}
                          onCheckedChange={() => toggleCategory(category.id)}
                        />
                        <Label htmlFor={category.id} className="flex-1 text-sm">
                          {category.label}
                        </Label>
                        <span className="text-xs text-warm-gray">({category.count})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Condition</Label>
                  <div className="space-y-2">
                    {conditions.map((condition) => (
                      <div key={condition.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={condition.id}
                          checked={searchParams.filters?.condition?.includes(condition.id) || false}
                          onCheckedChange={() => toggleCondition(condition.id)}
                        />
                        <Label htmlFor={condition.id} className="text-sm">
                          {condition.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Price Range</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={searchParams.filters?.priceRange?.[0] || 0}
                        onChange={(e) => {
                          const min = parseInt(e.target.value) || 0;
                          const max = searchParams.filters?.priceRange?.[1] || 1000;
                          handleFilterChange('priceRange', [min, max]);
                        }}
                        className="text-sm"
                      />
                      <span className="text-warm-gray">-</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={searchParams.filters?.priceRange?.[1] || 1000}
                        onChange={(e) => {
                          const max = parseInt(e.target.value) || 1000;
                          const min = searchParams.filters?.priceRange?.[0] || 0;
                          handleFilterChange('priceRange', [min, max]);
                        }}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* In Stock */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inStock"
                    checked={searchParams.filters?.inStock || false}
                    onCheckedChange={(checked) => handleFilterChange('inStock', checked)}
                  />
                  <Label htmlFor="inStock" className="text-sm">
                    In Stock Only
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
                
                <p className="text-sm text-warm-gray">
                  {total} products found
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <select
                  value={searchParams.sortBy || 'newest'}
                  onChange={(e) => handleSortChange(e.target.value as any)}
                  className="text-sm border border-gray-200 rounded-md px-3 py-2 bg-white"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Mode */}
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {searchParams.query && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: "{searchParams.query}"
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleSearch('')}
                    />
                  </Badge>
                )}
                {searchParams.filters?.category?.map((category) => (
                  <Badge key={category} variant="secondary" className="flex items-center gap-1">
                    {category}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => toggleCategory(category)}
                    />
                  </Badge>
                ))}
                {searchParams.filters?.condition?.map((condition) => (
                  <Badge key={condition} variant="secondary" className="flex items-center gap-1">
                    {condition.replace('_', ' ')}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => toggleCondition(condition)}
                    />
                  </Badge>
                ))}
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }>
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={setSelectedProduct}
                    onAddToCart={(product) => console.log('Add to cart:', product)}
                    onToggleWishlist={toggleWishlist}
                    isInWishlist={wishlist.includes(product.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-warm-gray text-lg mb-4">No products found</p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {total > (searchParams.limit || 12) && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={searchParams.page === 1}
                    onClick={() => setSearchParams(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}
                  >
                    Previous
                  </Button>
                  <span className="px-4 py-2 text-sm">
                    Page {searchParams.page || 1} of {Math.ceil(total / (searchParams.limit || 12))}
                  </span>
                  <Button
                    variant="outline"
                    disabled={(searchParams.page || 1) >= Math.ceil(total / (searchParams.limit || 12))}
                    onClick={() => setSearchParams(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(product) => console.log('Add to cart:', product)}
        onToggleWishlist={toggleWishlist}
        isInWishlist={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
      />
    </Layout>
  );
};

export default CollectionsPage;

