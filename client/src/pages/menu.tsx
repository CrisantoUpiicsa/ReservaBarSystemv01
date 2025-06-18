import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useMenuCategories, useMenuItems } from "@/hooks/use-menu";

export default function Menu() {
  const { data: categories, isLoading: categoriesLoading } = useMenuCategories();
  const { data: allItems, isLoading: itemsLoading } = useMenuItems();

  if (categoriesLoading || itemsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md h-96"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getItemsByCategory = (categoryId: number) => {
    return allItems?.filter(item => item.categoryId === categoryId) || [];
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      { bg: "bg-primary", text: "text-white" },
      { bg: "bg-secondary", text: "text-white" },
      { bg: "bg-accent", text: "text-white" },
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Menu Management</h1>
          <p className="text-gray-600">Manage your restaurant menu items and categories</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Menu Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories?.map((category, index) => {
          const items = getItemsByCategory(category.id);
          const colorScheme = getCategoryColor(index);
          
          return (
            <Card key={category.id} className="overflow-hidden">
              <CardHeader className={`${colorScheme.bg} ${colorScheme.text} p-4`}>
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {items.length > 0 ? (
                  items.map((item) => (
                    <div key={item.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="w-full h-32 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-lg font-bold text-primary">${item.price}</span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No items in this category</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!categories?.length && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No menu categories found</p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
      )}
    </div>
  );
}
