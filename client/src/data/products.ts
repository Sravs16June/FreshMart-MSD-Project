import tomatoesImg from "@/assets/products/tomatoes.jpg";
import broccoliImg from "@/assets/products/broccoli.jpg";
import bananasImg from "@/assets/products/bananas.jpg";
import carrotsImg from "@/assets/products/carrots.jpg";
import breadImg from "@/assets/products/bread.jpg";
import milkImg from "@/assets/products/milk.jpg";
import eggsImg from "@/assets/products/eggs.jpg";
import spinachImg from "@/assets/products/spinach.jpg";
import applesImg from "@/assets/products/apples.jpg";
import strawberriesImg from "@/assets/products/strawberries.jpg";
import orangesImg from "@/assets/products/oranges.jpg";
import mangoesImg from "@/assets/products/mangoes.jpg";
import bellpeppersImg from "@/assets/products/bellpeppers.jpg";
import potatoesImg from "@/assets/products/potatoes.jpg";
import onionsImg from "@/assets/products/onions.jpg";
import cheeseImg from "@/assets/products/cheese.jpg";
import yogurtImg from "@/assets/products/yogurt.jpg";
import croissantsImg from "@/assets/products/croissants.jpg";
import blueberriesImg from "@/assets/products/blueberries.jpg";
import avocadosImg from "@/assets/products/avocados.jpg";
import cucumbersImg from "@/assets/products/cucumbers.jpg";
import lettuceImg from "@/assets/products/lettuce.jpg";
import mushroomsImg from "@/assets/products/mushrooms.jpg";
import garlicImg from "@/assets/products/garlic.jpg";
import gingerImg from "@/assets/products/ginger.jpg";
import cornImg from "@/assets/products/corn.jpg";
import cauliflowerImg from "@/assets/products/cauliflower.jpg";
import greenbeansImg from "@/assets/products/greenbeans.jpg";
import watermelonImg from "@/assets/products/watermelon.jpg";
import grapesImg from "@/assets/products/grapes.jpg";
import pomegranateImg from "@/assets/products/pomegranate.jpg";
import papayaImg from "@/assets/products/papaya.jpg";
import butterImg from "@/assets/products/butter.jpg";
import paneerImg from "@/assets/products/paneer.jpg";
import creamImg from "@/assets/products/cream.jpg";
import muffinsImg from "@/assets/products/muffins.jpg";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  description: string;
  inStock: boolean;
  discount?: number;
  rating?: number;
  reviews?: number;
  nutritionalInfo?: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
  benefits?: string[];
  storageInstructions?: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Organic Tomatoes",
    category: "Vegetables",
    price: 60,
    unit: "500g",
    image: tomatoesImg,
    description: "Fresh, vine-ripened organic tomatoes. Perfect for salads, sauces, and cooking.",
    inStock: true,
    discount: 15,
    rating: 4.5,
    reviews: 128,
    nutritionalInfo: {
      calories: "18 per 100g",
      protein: "0.9g",
      carbs: "3.9g",
      fat: "0.2g"
    },
    benefits: ["Rich in Vitamin C", "High in antioxidants", "Low in calories", "Supports heart health"],
    storageInstructions: "Store at room temperature until ripe, then refrigerate for up to 1 week."
  },
  {
    id: 2,
    name: "Fresh Broccoli",
    category: "Vegetables",
    price: 80,
    unit: "head",
    image: broccoliImg,
    description: "Crisp, green organic broccoli florets. Rich in vitamins and nutrients.",
    inStock: true,
  },
  {
    id: 3,
    name: "Ripe Bananas",
    category: "Fruits",
    price: 50,
    unit: "bunch",
    image: bananasImg,
    description: "Sweet, perfectly ripe organic bananas. Great for snacking or smoothies.",
    inStock: true,
  },
  {
    id: 4,
    name: "Fresh Carrots",
    category: "Vegetables",
    price: 45,
    unit: "500g",
    image: carrotsImg,
    description: "Crunchy, sweet organic carrots with greens. Perfect for snacking or cooking.",
    inStock: true,
  },
  {
    id: 5,
    name: "Artisan Bread",
    category: "Bakery",
    price: 55,
    unit: "loaf",
    image: breadImg,
    description: "Freshly baked whole wheat artisan bread. Soft with a delicious crust.",
    inStock: true,
  },
  {
    id: 6,
    name: "Farm Fresh Milk",
    category: "Dairy",
    price: 65,
    unit: "1L",
    image: milkImg,
    description: "Fresh organic whole milk from local farms. Rich in calcium.",
    inStock: true,
  },
  {
    id: 7,
    name: "Free-Range Eggs",
    category: "Dairy",
    price: 90,
    unit: "dozen",
    image: eggsImg,
    description: "Farm fresh free-range eggs. Mix of brown and white eggs.",
    inStock: true,
  },
  {
    id: 8,
    name: "Fresh Spinach",
    category: "Vegetables",
    price: 40,
    unit: "250g",
    image: spinachImg,
    description: "Nutrient-rich organic spinach leaves. Perfect for salads and smoothies.",
    inStock: true,
  },
  {
    id: 9,
    name: "Green Apples",
    category: "Fruits",
    price: 120,
    unit: "1kg",
    image: applesImg,
    description: "Crisp and tangy green apples. Great for snacking and baking.",
    inStock: true,
  },
  {
    id: 10,
    name: "Strawberries",
    category: "Fruits",
    price: 180,
    unit: "250g",
    image: strawberriesImg,
    description: "Sweet organic strawberries. Freshly picked and delicious.",
    inStock: true,
  },
  {
    id: 11,
    name: "Oranges",
    category: "Fruits",
    price: 100,
    unit: "1kg",
    image: orangesImg,
    description: "Juicy fresh oranges. Rich in vitamin C.",
    inStock: true,
  },
  {
    id: 12,
    name: "Mangoes",
    category: "Fruits",
    price: 150,
    unit: "1kg",
    image: mangoesImg,
    description: "Sweet Alphonso mangoes. King of fruits.",
    inStock: true,
  },
  {
    id: 13,
    name: "Bell Peppers",
    category: "Vegetables",
    price: 80,
    unit: "3 pcs",
    image: bellpeppersImg,
    description: "Colorful bell peppers. Red, yellow, and green mix.",
    inStock: true,
  },
  {
    id: 14,
    name: "Potatoes",
    category: "Vegetables",
    price: 30,
    unit: "1kg",
    image: potatoesImg,
    description: "Fresh organic potatoes. Versatile and nutritious.",
    inStock: true,
  },
  {
    id: 15,
    name: "Onions",
    category: "Vegetables",
    price: 40,
    unit: "1kg",
    image: onionsImg,
    description: "Red onions. Essential kitchen staple.",
    inStock: true,
  },
  {
    id: 16,
    name: "Cheese",
    category: "Dairy",
    price: 220,
    unit: "200g",
    image: cheeseImg,
    description: "Organic cheddar cheese. Rich and creamy.",
    inStock: true,
  },
  {
    id: 17,
    name: "Greek Yogurt",
    category: "Dairy",
    price: 80,
    unit: "400g",
    image: yogurtImg,
    description: "Creamy Greek yogurt. High in protein.",
    inStock: true,
  },
  {
    id: 18,
    name: "Croissants",
    category: "Bakery",
    price: 120,
    unit: "4 pcs",
    image: croissantsImg,
    description: "Buttery croissants. Fresh from the oven.",
    inStock: true,
  },
  {
    id: 19,
    name: "Blueberries",
    category: "Fruits",
    price: 200,
    unit: "200g",
    image: blueberriesImg,
    description: "Fresh organic blueberries. Antioxidant rich.",
    inStock: true,
  },
  {
    id: 20,
    name: "Avocados",
    category: "Fruits",
    price: 150,
    unit: "3 pcs",
    image: avocadosImg,
    description: "Ripe avocados. Creamy and nutritious.",
    inStock: true,
  },
  {
    id: 21,
    name: "Cucumbers",
    category: "Vegetables",
    price: 35,
    unit: "500g",
    image: cucumbersImg,
    description: "Fresh cucumbers. Crisp and refreshing.",
    inStock: true,
  },
  {
    id: 22,
    name: "Lettuce",
    category: "Vegetables",
    price: 45,
    unit: "1 head",
    image: lettuceImg,
    description: "Crisp lettuce. Perfect for salads.",
    inStock: true,
  },
  {
    id: 23,
    name: "Mushrooms",
    category: "Vegetables",
    price: 90,
    unit: "250g",
    image: mushroomsImg,
    description: "Fresh button mushrooms. Earthy and delicious.",
    inStock: true,
  },
  {
    id: 24,
    name: "Garlic",
    category: "Vegetables",
    price: 60,
    unit: "200g",
    image: garlicImg,
    description: "Organic garlic bulbs. Essential for cooking.",
    inStock: true,
  },
  {
    id: 25,
    name: "Ginger",
    category: "Vegetables",
    price: 50,
    unit: "250g",
    image: gingerImg,
    description: "Fresh organic ginger. Great for cooking and tea.",
    inStock: true,
  },
  {
    id: 26,
    name: "Sweet Corn",
    category: "Vegetables",
    price: 40,
    unit: "2 pcs",
    image: cornImg,
    description: "Fresh sweet corn. Perfect for grilling.",
    inStock: true,
  },
  {
    id: 27,
    name: "Cauliflower",
    category: "Vegetables",
    price: 50,
    unit: "1 head",
    image: cauliflowerImg,
    description: "Fresh cauliflower. Versatile vegetable.",
    inStock: true,
  },
  {
    id: 28,
    name: "Green Beans",
    category: "Vegetables",
    price: 60,
    unit: "500g",
    image: greenbeansImg,
    description: "Tender green beans. Fresh and crunchy.",
    inStock: true,
  },
  {
    id: 29,
    name: "Watermelon",
    category: "Fruits",
    price: 40,
    unit: "1kg",
    image: watermelonImg,
    description: "Sweet watermelon. Refreshing summer fruit.",
    inStock: true,
  },
  {
    id: 30,
    name: "Grapes",
    category: "Fruits",
    price: 120,
    unit: "500g",
    image: grapesImg,
    description: "Sweet grapes. Red or green variety.",
    inStock: true,
  },
  {
    id: 31,
    name: "Pomegranate",
    category: "Fruits",
    price: 100,
    unit: "2 pcs",
    image: pomegranateImg,
    description: "Fresh pomegranates. Rich in antioxidants.",
    inStock: true,
  },
  {
    id: 32,
    name: "Papaya",
    category: "Fruits",
    price: 60,
    unit: "1 pc",
    image: papayaImg,
    description: "Ripe papaya. Sweet and healthy.",
    inStock: true,
  },
  {
    id: 33,
    name: "Butter",
    category: "Dairy",
    price: 120,
    unit: "200g",
    image: butterImg,
    description: "Organic butter. Rich and creamy.",
    inStock: true,
  },
  {
    id: 34,
    name: "Paneer",
    category: "Dairy",
    price: 150,
    unit: "250g",
    image: paneerImg,
    description: "Fresh paneer. High in protein.",
    inStock: true,
  },
  {
    id: 35,
    name: "Cream",
    category: "Dairy",
    price: 80,
    unit: "200ml",
    image: creamImg,
    description: "Fresh cream. Perfect for desserts.",
    inStock: true,
  },
  {
    id: 36,
    name: "Muffins",
    category: "Bakery",
    price: 100,
    unit: "4 pcs",
    image: muffinsImg,
    description: "Chocolate muffins. Freshly baked.",
    inStock: true,
  },
];
