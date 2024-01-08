# Task Manager 

## Quy Tắc Viết Code

### 1. Tuân Thủ Quy Ước Về Tên

- **Biến và Hàm:** Sử dụng camelCase cho biến và hàm (ví dụ: `myVariable`, `calculateTotal()`).
- **Lớp và Đối Tượng:** Sử dụng PascalCase cho tên lớp và đối tượng (ví dụ: `MyClass`, `MyObject`).

### 2. Tổ Chức Mã Nguồn

- **Tổ Chức Thư Mục:** Tổ chức thư mục một cách có tổ chức và dễ đọc.
- **Module và Components:** Tách code thành các module và components để tăng sự tái sử dụng và dễ duy trì.
- **Tóm Lược Code:** Sử dụng comment để mô tả các đoạn mã quan trọng.

### 3. Xử Lý Ngoại Lệ

- **Bắt và Xử Lý Ngoại Lệ Đầy Đủ:** Bảo đảm rằng mọi ngoại lệ đều được bắt và xử lý một cách đầy đủ để tránh lỗi không mong muốn.

### 4. Sử Dụng ES6/ES7

- **Sử Dụng Arrow Functions:** Sử dụng arrow functions khi có thể để giảm sự phức tạp của đoạn mã.

### 5. Đặt Chú Ý Đến Hiệu Năng

- **Tối Ưu Hóa Truy Vấn:** Tránh các truy vấn không hiệu quả, và sử dụng chỉ cần thiết các trường trong truy vấn GraphQL.

### 6. Hạn Chế Lồng If vào Nhau

- **Hạn Chế Lồng If vào Nhau:** Tránh lồng quá nhiều câu lệnh `if` vào nhau để giảm sự phức tạp và làm cho code dễ đọc hơn.
- **Sử Dụng Early Return:** Khi có thể, sử dụng cách trả về sớm để tránh lồng quá nhiều lệnh `if`. Ví dụ:
    ```javascript
    if (!<trường hợp sai>) {
      return;
    }
    // Xử lý cho trường hợp đúng
    ```

## Cài Đặt Dự Án Trước Khi Chạy

```bash
npm install
npm run sever
