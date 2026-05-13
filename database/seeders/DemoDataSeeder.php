<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Invoice;
use App\Models\Product;
use Illuminate\Database\Seeder;

class DemoDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            ['id' => 'g1', 'name' => 'Shirt (Gents)', 'name_bn' => 'শার্ট', 'category' => 'Gents', 'price' => 15],
            ['id' => 'g2', 'name' => 'T-Shirt (Gents)', 'name_bn' => 'টি-শার্ট', 'category' => 'Gents', 'price' => 15],
            ['id' => 'g3', 'name' => 'Fatua', 'name_bn' => 'ফতুয়া', 'category' => 'Gents', 'price' => 20],
            ['id' => 'g4', 'name' => 'Panjabi (Cotton)', 'name_bn' => 'পাঞ্জাবি (সুতি)', 'category' => 'Gents', 'price' => 25],
            ['id' => 'g5', 'name' => 'Panjabi Cotton (Starch)', 'name_bn' => 'পাঞ্জাবি (সুতি) মাড় সহ', 'category' => 'Gents', 'price' => 30],
            ['id' => 'g6', 'name' => 'Panjabi (Silk)', 'name_bn' => 'পাঞ্জাবি (সিল্ক)', 'category' => 'Gents', 'price' => 40],
            ['id' => 'g7', 'name' => 'Jubba', 'name_bn' => 'জুব্বা', 'category' => 'Gents', 'price' => 30],
            ['id' => 'g8', 'name' => 'Pant (Formal)', 'name_bn' => 'প্যান্ট (ফরমাল)', 'category' => 'Gents', 'price' => 15],
            ['id' => 'g9', 'name' => 'Jeans Pant', 'name_bn' => 'জিন্স প্যান্ট', 'category' => 'Gents', 'price' => 25],
            ['id' => 'g10', 'name' => 'Payjama', 'name_bn' => 'পায়জামা', 'category' => 'Gents', 'price' => 15],
            ['id' => 'g11', 'name' => 'Towel (Gents)', 'name_bn' => 'টাওয়ার', 'category' => 'Gents', 'price' => 15],
            ['id' => 'g12', 'name' => 'Half Pant', 'name_bn' => 'হাফ প্যান্ট', 'category' => 'Gents', 'price' => 15],
            ['id' => 'g13', 'name' => 'Lungi (Starch)', 'name_bn' => 'লুঙ্গি (মাড় সহ)', 'category' => 'Gents', 'price' => 25],
            ['id' => 'g14', 'name' => 'Shawl (Gents)', 'name_bn' => 'শাল', 'category' => 'Gents', 'price' => 40],
            ['id' => 'g15', 'name' => 'Sweater (Gents)', 'name_bn' => 'সোয়েটার', 'category' => 'Gents', 'price' => 80],
            ['id' => 'g16', 'name' => 'Sherwani (Normal)', 'name_bn' => 'শেরওয়ানি (সাধারণ)', 'category' => 'Gents', 'price' => 170],
            ['id' => 'g17', 'name' => 'Sherwani (Designer)', 'name_bn' => 'শেরওয়ানি (ডিজাইনার)', 'category' => 'Gents', 'price' => 250],
            ['id' => 'g18', 'name' => 'Blazer/Coat', 'name_bn' => 'ব্রেজার/কোট', 'category' => 'Gents', 'price' => 120],
            ['id' => 'g19', 'name' => 'Suit (3 Pcs)', 'name_bn' => 'স্যুট (৩ পিস)', 'category' => 'Gents', 'price' => 160],
            ['id' => 'g20', 'name' => 'Prince Coat', 'name_bn' => 'প্রিন্স কোট', 'category' => 'Gents', 'price' => 120],
            ['id' => 'g21', 'name' => 'Koti', 'name_bn' => 'কটি', 'category' => 'Gents', 'price' => 80],
            ['id' => 'g22', 'name' => 'Tie', 'name_bn' => 'টাই', 'category' => 'Gents', 'price' => 15],
            ['id' => 'g23', 'name' => 'Jacket (Cloth)', 'name_bn' => 'জ্যাকেট (কাপড়)', 'category' => 'Gents', 'price' => 80],
            ['id' => 'g24', 'name' => 'Jacket (Leather)', 'name_bn' => 'জ্যাকেট (চামড়া)', 'category' => 'Gents', 'price' => 180],
            ['id' => 'l1', 'name' => 'Kamiz/Kurti', 'name_bn' => 'কামিজ/কুর্তি', 'category' => 'Ladies', 'price' => 30],
            ['id' => 'l2', 'name' => '3 Pcs (Normal)', 'name_bn' => '৩ পিস (সাধারণ)', 'category' => 'Ladies', 'price' => 60],
            ['id' => 'l3', 'name' => '3 Pcs (Designer)', 'name_bn' => '৩ পিস (ডিজাইনার)', 'category' => 'Ladies', 'price' => 150],
            ['id' => 'l4', 'name' => 'Orna', 'name_bn' => 'ওড়না', 'category' => 'Ladies', 'price' => 30],
            ['id' => 'l5', 'name' => 'Hijab', 'name_bn' => 'হিজাব', 'category' => 'Ladies', 'price' => 20],
            ['id' => 'l6', 'name' => 'Scarf', 'name_bn' => 'স্কার্ফ', 'category' => 'Ladies', 'price' => 20],
            ['id' => 'l7', 'name' => 'Shirt (Ladies)', 'name_bn' => 'শার্ট (লেডিস)', 'category' => 'Ladies', 'price' => 20],
            ['id' => 'l8', 'name' => 'Pant (Ladies)', 'name_bn' => 'প্যান্ট (লেডিস)', 'category' => 'Ladies', 'price' => 20],
            ['id' => 'l9', 'name' => 'Salowar', 'name_bn' => 'সেলোয়ার', 'category' => 'Ladies', 'price' => 20],
            ['id' => 'l10', 'name' => 'Skirt', 'name_bn' => 'স্কার্ট', 'category' => 'Ladies', 'price' => 40],
            ['id' => 'l11', 'name' => 'Saree (Cotton+Starch)', 'name_bn' => 'শাড়ি (সুতি) মাড় সহ', 'category' => 'Ladies', 'price' => 100],
            ['id' => 'l12', 'name' => 'Saree Banarasi Cover', 'name_bn' => 'শাড়ি বেনারসি কাভার', 'category' => 'Ladies', 'price' => 350],
            ['id' => 'l13', 'name' => 'Saree Georgette', 'name_bn' => 'শাড়ি জর্জেট', 'category' => 'Ladies', 'price' => 150],
            ['id' => 'l14', 'name' => 'Saree Jamdani (Cotton)', 'name_bn' => 'শাড়ি জামদানি (সুতি)', 'category' => 'Ladies', 'price' => 140],
            ['id' => 'l15', 'name' => 'Saree Silk', 'name_bn' => 'শাড়ি সিল্ক', 'category' => 'Ladies', 'price' => 160],
            ['id' => 'l16', 'name' => 'Lehenga (Ladies)', 'name_bn' => 'লেহেঙ্গা', 'category' => 'Ladies', 'price' => 350],
            ['id' => 'l17', 'name' => 'Gown (Normal)', 'name_bn' => 'গাউন (সাধারণ)', 'category' => 'Ladies', 'price' => 220],
            ['id' => 'l18', 'name' => 'Gown (Designer)', 'name_bn' => 'গাউন (ডিজাইনার)', 'category' => 'Ladies', 'price' => 300],
            ['id' => 'l19', 'name' => 'Maxi', 'name_bn' => 'মেক্সি', 'category' => 'Ladies', 'price' => 35],
            ['id' => 'l20', 'name' => 'Sportcoat (Ladies)', 'name_bn' => 'স্পোর্টকোট', 'category' => 'Ladies', 'price' => 35],
            ['id' => 'l21', 'name' => 'Suit 2 Pcs (Ladies)', 'name_bn' => 'স্যুট (২ পিস)', 'category' => 'Ladies', 'price' => 160],
            ['id' => 'l22', 'name' => 'Blazer (Ladies)', 'name_bn' => 'ব্রেজার', 'category' => 'Ladies', 'price' => 140],
            ['id' => 'l23', 'name' => 'Sweater (Ladies)', 'name_bn' => 'সোয়েটার', 'category' => 'Ladies', 'price' => 80],
            ['id' => 'l24', 'name' => 'Shawl (Ladies)', 'name_bn' => 'শাল', 'category' => 'Ladies', 'price' => 40],
            ['id' => 'l25', 'name' => 'Borka', 'name_bn' => 'বোরকা', 'category' => 'Ladies', 'price' => 60],
            ['id' => 'l26', 'name' => 'Abaya', 'name_bn' => 'আবায়া', 'category' => 'Ladies', 'price' => 60],
            ['id' => 'k1', 'name' => 'Shirt (Kids)', 'name_bn' => 'শার্ট (বাচ্চা)', 'category' => 'Kids', 'price' => 15],
            ['id' => 'k2', 'name' => 'T-Shirt (Kids)', 'name_bn' => 'টি-শার্ট (বাচ্চা)', 'category' => 'Kids', 'price' => 15],
            ['id' => 'k3', 'name' => 'Panjabi Cotton (Kids)', 'name_bn' => 'পাঞ্জাবি (সুতি)', 'category' => 'Kids', 'price' => 25],
            ['id' => 'k4', 'name' => 'Panjabi Silk (Kids)', 'name_bn' => 'পাঞ্জাবি (সিল্ক)', 'category' => 'Kids', 'price' => 30],
            ['id' => 'k5', 'name' => 'Pant (Kids)', 'name_bn' => 'প্যান্ট', 'category' => 'Kids', 'price' => 15],
            ['id' => 'k6', 'name' => 'Payjama (Kids)', 'name_bn' => 'পায়জামা', 'category' => 'Kids', 'price' => 15],
            ['id' => 'k7', 'name' => 'Towel (Kids)', 'name_bn' => 'টাওয়ার', 'category' => 'Kids', 'price' => 15],
            ['id' => 'k8', 'name' => 'Kamiz 2 Pcs (Kids)', 'name_bn' => 'কামিজ (২পিস)', 'category' => 'Kids', 'price' => 40],
            ['id' => 'k9', 'name' => 'Kamiz 3 Pcs (Kids)', 'name_bn' => 'কামিজ (৩ পিস)', 'category' => 'Kids', 'price' => 60],
            ['id' => 'k10', 'name' => 'Frock (Heavy)', 'name_bn' => 'ফ্রক (ভারী)', 'category' => 'Kids', 'price' => 120],
            ['id' => 'k11', 'name' => 'Orna (Kids)', 'name_bn' => 'ওড়না', 'category' => 'Kids', 'price' => 25],
            ['id' => 'k12', 'name' => 'Lehenga (Kids)', 'name_bn' => 'লেহেঙ্গা', 'category' => 'Kids', 'price' => 300],
            ['id' => 'k13', 'name' => 'Full Dress (Kids)', 'name_bn' => 'ফুল ড্রেস', 'category' => 'Kids', 'price' => 60],
            ['id' => 'k14', 'name' => 'Suit 3 Pcs (Kids)', 'name_bn' => 'স্যুট (৩ পিস)', 'category' => 'Kids', 'price' => 160],
            ['id' => 'k15', 'name' => 'Blazer (Kids)', 'name_bn' => 'ব্রেজার', 'category' => 'Kids', 'price' => 100],
            ['id' => 'k16', 'name' => 'Jacket Cloth (Kids)', 'name_bn' => 'জ্যাকেট (কাপড়)', 'category' => 'Kids', 'price' => 60],
            ['id' => 'k17', 'name' => 'Jacket Leather (Kids)', 'name_bn' => 'জ্যাকেট (চামড়া)', 'category' => 'Kids', 'price' => 120],
            ['id' => 'k18', 'name' => 'Jacket Wool (Kids)', 'name_bn' => 'জ্যাকেট (উল)', 'category' => 'Kids', 'price' => 80],
            ['id' => 'k19', 'name' => 'Sherwani Normal (Kids)', 'name_bn' => 'শেরওয়ানি (সাধারণ)', 'category' => 'Kids', 'price' => 150],
            ['id' => 'k20', 'name' => 'Sherwani Designer (Kids)', 'name_bn' => 'শেরওয়ানি (ডিজাইনার)', 'category' => 'Kids', 'price' => 220],
            ['id' => 'k21', 'name' => 'Prince Coat (Kids)', 'name_bn' => 'প্রিন্স কোট', 'category' => 'Kids', 'price' => 80],
            ['id' => 'k22', 'name' => 'Tie (Kids)', 'name_bn' => 'টাই', 'category' => 'Kids', 'price' => 15],
            ['id' => 'k23', 'name' => 'Baby Blanket', 'name_bn' => 'বেবি কম্বল', 'category' => 'Kids', 'price' => 100],
            ['id' => 'h1', 'name' => 'Curtain (Small)', 'name_bn' => 'পর্দা (ছোট)', 'category' => 'Household', 'price' => 50],
            ['id' => 'h2', 'name' => 'Curtain (Big)', 'name_bn' => 'পর্দা (বড়)', 'category' => 'Household', 'price' => 70],
            ['id' => 'h3', 'name' => 'Curtain Small (Heavy)', 'name_bn' => 'পর্দা (ছোট) ভারী', 'category' => 'Household', 'price' => 70],
            ['id' => 'h4', 'name' => 'Curtain Big (Heavy)', 'name_bn' => 'পর্দা (বড়) ভারী', 'category' => 'Household', 'price' => 90],
            ['id' => 'h5', 'name' => 'Sofa Cover (Small)', 'name_bn' => 'সোফা কাভার (ছোট)', 'category' => 'Household', 'price' => 30],
            ['id' => 'h6', 'name' => 'Sofa Cover (Big)', 'name_bn' => 'সোফা কাভার (বড়)', 'category' => 'Household', 'price' => 60],
            ['id' => 'h7', 'name' => 'TV Cover', 'name_bn' => 'টিভি কাভার', 'category' => 'Household', 'price' => 30],
            ['id' => 'h8', 'name' => 'Table Cloth (Small)', 'name_bn' => 'টেবিল ক্লথ (ছোট)', 'category' => 'Household', 'price' => 30],
            ['id' => 'h9', 'name' => 'Table Cloth (Big)', 'name_bn' => 'টেবিল ক্লথ (বড়)', 'category' => 'Household', 'price' => 50],
            ['id' => 'h10', 'name' => 'Chair Cover', 'name_bn' => 'চেয়ার কাভার', 'category' => 'Household', 'price' => 25],
            ['id' => 'h11', 'name' => 'Bed Sheet (Small)', 'name_bn' => 'বেড শিট (ছোট)', 'category' => 'Household', 'price' => 30],
            ['id' => 'h12', 'name' => 'Bed Sheet (Big)', 'name_bn' => 'বেড শিট (বড়)', 'category' => 'Household', 'price' => 50],
            ['id' => 'h13', 'name' => 'Bed Cover (Small)', 'name_bn' => 'বেড কাভার (ছোট)', 'category' => 'Household', 'price' => 40],
            ['id' => 'h14', 'name' => 'Bed Cover (Big)', 'name_bn' => 'বেড কাভার (বড়)', 'category' => 'Household', 'price' => 60],
            ['id' => 'h15', 'name' => 'Pillow Cover', 'name_bn' => 'বালিশ কাভার', 'category' => 'Household', 'price' => 20],
            ['id' => 'h16', 'name' => 'Quilt Cover (Small)', 'name_bn' => 'লেপের কাভার (ছোট)', 'category' => 'Household', 'price' => 60],
            ['id' => 'h17', 'name' => 'Quilt Cover (Big)', 'name_bn' => 'লেপের কাভার (বড়)', 'category' => 'Household', 'price' => 80],
            ['id' => 'h18', 'name' => 'Kantha (Small)', 'name_bn' => 'কাঁথা (ছোট)', 'category' => 'Household', 'price' => 80],
            ['id' => 'h19', 'name' => 'Kantha (Big)', 'name_bn' => 'কাঁথা (বড়)', 'category' => 'Household', 'price' => 120],
            ['id' => 'h20', 'name' => 'Blanket (Small)', 'name_bn' => 'কম্বল (ছোট)', 'category' => 'Household', 'price' => 120],
            ['id' => 'h21', 'name' => 'Blanket (Big)', 'name_bn' => 'কম্বল (বড়)', 'category' => 'Household', 'price' => 150],
            ['id' => 'h22', 'name' => 'Comforter (Small)', 'name_bn' => 'কম্ফোর্টার (ছোট)', 'category' => 'Household', 'price' => 120],
            ['id' => 'h23', 'name' => 'Comforter (Big)', 'name_bn' => 'কম্ফোর্টার (বড়)', 'category' => 'Household', 'price' => 150],
            ['id' => 'h24', 'name' => 'Jaynamaz', 'name_bn' => 'জায়নামাজ', 'category' => 'Household', 'price' => 40],
            ['id' => 'h25', 'name' => 'Towel (Household)', 'name_bn' => 'টাওয়েল', 'category' => 'Household', 'price' => 40],
            ['id' => 'o1', 'name' => 'Doll (Small)', 'name_bn' => 'পুতুল (ছোট)', 'category' => 'Others', 'price' => 100],
            ['id' => 'o2', 'name' => 'Doll (Medium)', 'name_bn' => 'পুতুল (মাঝারী)', 'category' => 'Others', 'price' => 300],
            ['id' => 'o3', 'name' => 'Doll (Big)', 'name_bn' => 'পুতুল (বড়)', 'category' => 'Others', 'price' => 500],
            ['id' => 'o4', 'name' => 'Backpack', 'name_bn' => 'পিঠের ব্যাগ', 'category' => 'Others', 'price' => 200],
            ['id' => 'o5', 'name' => 'Carry Bag', 'name_bn' => 'কেরি ব্যাগ', 'category' => 'Others', 'price' => 250],
            ['id' => 'o6', 'name' => 'Rikshon', 'name_bn' => 'রিকশন', 'category' => 'Others', 'price' => 150],
            ['id' => 'o7', 'name' => 'Ladies Hand Bag', 'name_bn' => 'লেডিস হ্যান্ড ব্যাগ', 'category' => 'Others', 'price' => 200],
            ['id' => 'o8', 'name' => 'Car Seat Cover (Small)', 'name_bn' => 'কার সিট কভার (ছোট)', 'category' => 'Others', 'price' => 80],
            ['id' => 'o9', 'name' => 'Car Seat Cover (Big)', 'name_bn' => 'কার সিট কভার (বড়)', 'category' => 'Others', 'price' => 150],
            ['id' => 'o10', 'name' => 'Carpet (per sq ft)', 'name_bn' => 'কার্পেট (স্কয়ার ফিট)', 'category' => 'Others', 'price' => 15],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }

        $clients = [
            ['name' => 'Rahim Uddin', 'phone' => '01712345678', 'address' => 'Mirpur 10, Dhaka', 'total_orders' => 23, 'total_due' => 450, 'total_paid' => 3200],
            ['name' => 'Fatema Begum', 'phone' => '01898765432', 'address' => 'Dhanmondi 27, Dhaka', 'total_orders' => 15, 'total_due' => 0, 'total_paid' => 2100],
            ['name' => 'Kamal Hossain', 'phone' => '01611223344', 'address' => 'Uttara Sec 7, Dhaka', 'total_orders' => 8, 'total_due' => 320, 'total_paid' => 980],
            ['name' => 'Nasrin Akter', 'phone' => '01555667788', 'address' => 'Gulshan 2, Dhaka', 'total_orders' => 31, 'total_due' => 150, 'total_paid' => 5600],
            ['name' => 'Shahidul Islam', 'phone' => '01777889900', 'address' => 'Banani, Dhaka', 'total_orders' => 12, 'total_due' => 800, 'total_paid' => 1450],
        ];

        $clientModels = [];
        foreach ($clients as $client) {
            $clientModels[$client['name']] = Client::create($client);
        }

        $invoices = [
            ['id' => 'INV-20260501', 'date' => '2026-05-01', 'client' => 'Rahim Uddin', 'total' => 185, 'paid' => 185, 'due' => 0, 'status' => 'Delivered', 'method' => 'Cash'],
            ['id' => 'INV-20260502', 'date' => '2026-05-02', 'client' => 'Fatema Begum', 'total' => 90, 'paid' => 90, 'due' => 0, 'status' => 'Delivered', 'method' => 'Bkash'],
            ['id' => 'INV-20260503', 'date' => '2026-05-03', 'client' => 'Kamal Hossain', 'total' => 320, 'paid' => 0, 'due' => 320, 'status' => 'Processing', 'method' => 'Cash'],
            ['id' => 'INV-20260504', 'date' => '2026-05-04', 'client' => 'Nasrin Akter', 'total' => 450, 'paid' => 300, 'due' => 150, 'status' => 'In House', 'method' => 'Bank'],
            ['id' => 'INV-20260505', 'date' => '2026-05-05', 'client' => 'Rahim Uddin', 'total' => 265, 'paid' => 265, 'due' => 0, 'status' => 'Delivered', 'method' => 'Bkash'],
            ['id' => 'INV-20260506', 'date' => '2026-05-06', 'client' => 'Shahidul Islam', 'total' => 800, 'paid' => 0, 'due' => 800, 'status' => 'Processing', 'method' => 'Cash'],
            ['id' => 'INV-20260507', 'date' => '2026-05-07', 'client' => 'Fatema Begum', 'total' => 150, 'paid' => 150, 'due' => 0, 'status' => 'In House', 'method' => 'Bkash'],
            ['id' => 'INV-20260508', 'date' => '2026-05-08', 'client' => 'Nasrin Akter', 'total' => 210, 'paid' => 210, 'due' => 0, 'status' => 'Delivered', 'method' => 'Cash'],
        ];

        foreach ($invoices as $invoice) {
            $clientName = $invoice['client'];
            unset($invoice['client']);
            $invoice['client_id'] = $clientModels[$clientName]->id;
            Invoice::create($invoice);
        }
    }
}
