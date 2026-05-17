<?xml version="1.0" encoding="utf-8"?>
<modification>
    <name>Againcart Inventory Module</name>
    <code>againcart-inventory-module</code>
    <version>3.x</version>
    <author>againsoft</author>
    <link>https://www.againsoft.com</link>
    <file path="admin/controller/common/column_left.php">
        <operation>
            <search><![CDATA[if ($this->user->hasPermission('access', 'tool/upload')) {]]></search>
            <add position="before"><![CDATA[
            if ($this->user->hasPermission('access', 'extension/module/inventory_module')) {
                $submenus = array();

                // 1. Inventory Manager Controller
                if ($this->user->hasPermission('access', 'extension/module/inventory_module/inventory')) {
                    $submenus[] = array(
                        'name' => 'All Products',
                        'href' => $this->url->link('extension/module/inventory_module/all_products', 'user_token=' . $this->session->data['user_token'], true),
                    );
                    $submenus[] = array(
                        'name' => 'Inventory Manager',
                        'href' => $this->url->link('extension/module/inventory_module/inventory', 'user_token=' . $this->session->data['user_token'], true),
                    );
                    $submenus[] = array(
                        'name' => 'Low Stock Products',
                        'href' => $this->url->link('extension/module/inventory_module/low_stock', 'user_token=' . $this->session->data['user_token'], true),
                    );
                    $submenus[] = array(
                        'name' => 'Out of Stock Products',
                        'href' => $this->url->link('extension/module/inventory_module/out_of_stock', 'user_token=' . $this->session->data['user_token'], true),
                    );
                    $submenus[] = array(
                        'name' => 'Inventory History',
                        'href' => $this->url->link('extension/module/inventory_module/history', 'user_token=' . $this->session->data['user_token'], true),
                    );
                    $submenus[] = array(
                        'name' => 'Inventory Update',
                        'href' => $this->url->link('extension/module/inventory_module/update', 'user_token=' . $this->session->data['user_token'], true),
                    );
                    $submenus[] = array(
                        'name' => 'Lot Merge History',
                        'href' => $this->url->link('extension/module/inventory_module/lot_merge', 'user_token=' . $this->session->data['user_token'], true),
                    );
                    $submenus[] = array(
                        'name' => 'Product Gifts',
                        'href' => $this->url->link('extension/module/inventory_module/gift', 'user_token=' . $this->session->data['user_token'], true),
                    );

                    $submenus[] = array(
                        'name' => 'Top Selling Products',
                        'href' => $this->url->link('extension/module/inventory_module/top_selling', 'user_token=' . $this->session->data['user_token'], true),
                    );
                    $submenus[] = array(
                        'name' => 'Supplier Manager',
                        'href' => $this->url->link('extension/module/inventory_module/supplier', 'user_token=' . $this->session->data['user_token'], true),
                    );
                    $submenus[] = array(
                        'name' => 'Inventory Report',
                        'href' => $this->url->link('extension/module/inventory_module/report', 'user_token=' . $this->session->data['user_token'], true),
                    );
                    $submenus[] = array(
                        'name' => 'Order History',
                        'href' => $this->url->link('extension/module/inventory_module/order_history', 'user_token=' . $this->session->data['user_token'], true),
                    );

                }

                // 2. Payroll Controller
                if ($this->user->hasPermission('access', 'extension/module/inventory_module/payroll')) {
                    $submenus[] = array(
                        'name' => 'Payroll Manager',
                        'href' => $this->url->link('extension/module/inventory_module/payroll', 'user_token=' . $this->session->data['user_token'], true),
                    );
                    $submenus[] = array(
                        'name' => 'Employee List',
                        'href' => $this->url->link('extension/module/inventory_module/payroll/employee', 'user_token=' . $this->session->data['user_token'], true),
                    );
                }



                // 3. Expense Controller
                if ($this->user->hasPermission('access', 'extension/module/inventory_module/expense')) {
                    $submenus[] = array(
                        'name' => 'Expense Manager',
                        'href' => $this->url->link('extension/module/inventory_module/expense', 'user_token=' . $this->session->data['user_token'], true),
                    );

                    $submenus[] = array(
                        'name' => 'Expense Category',
                        'href' => $this->url->link('extension/module/inventory_module/expense/category', 'user_token=' . $this->session->data['user_token'], true),
                    );
                }

                // Main Menu Icon & Name
                if ($submenus) {
                    $data['menus'][] = array(
                        'id'       => 'menu-inventory-module',
                        'icon'     => 'fa-money',
                        'name'     => 'Inventory Module',
                        'href'     => '',
                        'children' => $submenus
                    );
                }
            }
            ]]></add>
        </operation>
    </file>
</modification>
