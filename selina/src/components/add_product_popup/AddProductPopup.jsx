import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useState, useEffect } from "react"
import ProductForm from "../product_form/ProductForm"

export default function AddProductPopup({set_has_token}) {
    const [open, set_open] = useState(false);

    const handle_click_open = () => {
      set_open(true)
    }
  
    const handle_close = () => {
      set_open(false)
    }

    return (
        <div className="add-product-popup">
            <Button 
                variant="contained" 
                onClick={handle_click_open}
                className="add-product-popup__add-product-btn"
                style={{
                    borderRadius: 40,
                    backgroundColor: "#32a4ea",
                    lineHeight: 40,
                    transition: 0.25,
                    height: 40
                }}
            >
                +&nbsp;&nbsp;&nbsp;Thêm sản phẩm
            </Button>
            <Dialog 
                open={open} 
                onClose={handle_close} 
                maxWidth={false}
            >
                <ProductForm set_open={set_open} set_has_token={set_has_token}/>
            </Dialog>
        </div>
    )
}