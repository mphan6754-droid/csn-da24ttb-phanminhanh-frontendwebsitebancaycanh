import { useMemo, useState } from "react";
import AccountMenu from "./Dangnhap/Dangky";
import { CartMenu } from "./GioHang";
import TheSanPham from "./TheSanPham";
import { loadProductSales } from "./DlieuDonhangStorage";

export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  group: string;
  origin?: string;
  description: string;
  light: string;
  watering: string;
  care: string;
  size: string;
  placement?: string;
};

const productCatalog = [
  {
    id: 1,
    name: "Cây Sen Đá",
    price: 35000,
    category: "Sen đá",
    group: "Cây mini",
    description: "Cây nhỏ gọn, thích hợp trang trí bàn học.",
    light: "Ánh sáng tự nhiên, thoáng mát; tránh nắng gắt buổi trưa.",
    watering: "Tưới khi đất đã khô hoàn toàn, khoảng 1–2 lần mỗi tuần.",
    care: "Dùng đất thoát nước tốt và chậu có lỗ thoát nước.",
    size: "Chậu mini, cao khoảng 8–12 cm.",
  },
  {
    id: 2,
    name: "Cây Xương Rồng",
    price: 45000,
    category: "Xương rồng",
    group: "Cây mini",
    description: "Dễ chăm sóc, thích hợp đặt ở nơi có ánh sáng.",
    light: "Ưa nơi nhiều ánh sáng, có thể nhận nắng nhẹ mỗi ngày.",
    watering: "Tưới ít, chỉ tưới khi đất khô; tránh để cây bị úng.",
    care: "Đặt nơi thông thoáng và dùng giá thể thoát nước tốt.",
    size: "Chậu mini, cao khoảng 8–15 cm tùy loại.",
  },
  {
    id: 3,
    name: "Cây Kim Ngân",
    price: 85000,
    category: "Kim Ngân",
    group: "Cây văn phòng",
    description: "Cây Kim Ngân có dáng đẹp, phù hợp trang trí bàn làm việc, phòng khách hoặc sảnh.",
    light: "Cây ưa ánh sáng gián tiếp. Tránh để cây dưới nắng gắt.",
    watering: "Tưới 1–2 lần mỗi tuần, để đất khô nhẹ giữa các lần tưới.",
    care: "Phun sương nhẹ lên lá để giữ độ ẩm trong phòng điều hòa.",
    size: "Cây cao khoảng 20–35 cm, có thể trồng chậu hoặc để dây rủ.",
  },
  {
    id: 4,
    name: "Cây Phát Tài",
    price: 120000,
    category: "Phát Tài",
    group: "Cây phong thủy",
    description: "Cây dễ chăm sóc, phù hợp trang trí không gian sống và làm việc.",
    light: "Ánh sáng tán xạ hoặc nơi sáng nhẹ trong nhà.",
    watering: "Tưới vừa đủ khi đất bắt đầu khô, không để nước đọng ở gốc.",
    care: "Giữ đất tơi xốp, lau lá và xoay chậu để cây nhận sáng đều.",
    size: "Cây cao khoảng 20–30 cm.",
  },
  {
    id: 5,
    name: "Cây Lưỡi Hổ Mini",
    price: 75000,
    category: "Lưỡi hổ",
    group: "Cây phong thủy",
    description: "Dáng cây gọn gàng, dễ chăm sóc và phù hợp với nhiều không gian.",
    light: "Phát triển tốt ở nơi có ánh sáng gián tiếp, chịu bóng nhẹ.",
    watering: "Tưới khi đất khô; cây thường cần ít nước hơn vào những ngày mát.",
    care: "Trồng trong đất thoát nước tốt và tránh tưới quá nhiều.",
    size: "Chậu mini, cao khoảng 10–20 cm.",
  },
  {
    id: 6,
    name: "Cây Kim Tiền",
    price: 120000,
    category: "Kim Tiền",
    group: "Cây phong thủy",
    description: "Cây Kim Tiền có lá xanh bóng, dáng khỏe khoắn và thường được chọn để trang trí nhà ở, văn phòng.",
    light: "Phát triển tốt ở nơi có ánh sáng gián tiếp, chịu bóng nhẹ.",
    watering: "Tưới khi đất đã khô; tránh để nước đọng lâu trong chậu.",
    care: "Đặt cây ở nơi thoáng, có ánh sáng gián tiếp và dùng đất thoát nước tốt.",
    size: "Chậu mini, cao khoảng 20–25 cm.",
  },
  {
    id: 7,
    name: "Cây Phú Quý",
    price: 85000,
    category: "Phú Quý",
    group: "Cây phong thủy",
    description: "Cây Phú Quý nổi bật với sắc lá xanh pha đỏ, thích hợp trang trí bàn làm việc hoặc phòng khách.",
    light: "Cây ưa ánh sáng tán xạ, tránh nắng gắt trực tiếp.",
    watering: "Tưới khi đất bắt đầu khô; nếu trồng thủy sinh, thay nước định kỳ.",
    care: "Đặt cây ở nơi có ánh sáng tán xạ và tránh nắng gắt.",
    size: "Chậu mini, cao khoảng 10–20 cm.",
  },
  {
    id: 8,
    name: "Cây Ngọc Ngân",
    price: 85000,
    category: "Ngọc Ngân",
    group: "Cây phong thủy",
    description: "Cây Ngọc Ngân có lá xanh điểm trắng đẹp mắt, phù hợp trang trí bàn làm việc hoặc góc phòng.",
    light: "Cây ưa bóng mát, tránh nắng trực tiếp.",
    watering: "Tưới khi bề mặt đất bắt đầu khô; tránh để cây bị úng.",
    care: "Đặt cây ở nơi thoáng mát, có ánh sáng gián tiếp.",
    size: "Cây cao khoảng 20–60 cm.",
  },
  {
    id: 9,
    name: "Cây Trầu Bà Leo",
    price: 120000,
    category: "Trầu Bà Leo",
    group: "Cây văn phòng",
    description: "Trầu Bà Leo có dáng dây mềm mại, phù hợp treo hoặc đặt trên kệ để tạo điểm nhấn xanh.",
    light: "Cây ưa ánh sáng gián tiếp, tránh nắng gắt trực tiếp.",
    watering: "Tưới khi đất se khô, điều chỉnh lượng nước theo điều kiện thời tiết.",
    care: "Cây chịu bóng nhẹ. Tỉa dây dài để giữ dáng gọn gàng và khuyến khích cây ra nhánh mới.",
    size: "Cây dạng dây leo, có thể buông rủ.",
  },
  {
    id: 10,
    name: "Cây Trầu Bà Đế Vương",
    price: 180000,
    category: "Trầu Bà Đế Vương",
    group: "Cây văn phòng",
    description: "Trầu Bà Đế Vương có tán lá lớn, màu xanh đậm hoặc đỏ tía, tạo điểm nhấn nổi bật cho căn phòng.",
    light: "Cây phù hợp với ánh sáng gián tiếp và có thể chịu bóng nhẹ.",
    watering: "Tưới vừa phải khi đất khô; tránh để nước đọng ở gốc.",
    care: "Chờ đất khô nhẹ rồi mới tưới lại. Tránh tưới quá nhiều để hạn chế úng rễ.",
    size: "Cây trồng chậu, có tán lá lớn.",
  },
  {
    id: 11,
    name: "Cây Hồng Môn",
    price: 95000,
    category: "Hồng Môn",
    group: "Cây văn phòng",
    description: "Hồng Môn nổi bật với hoa đỏ rực và lá xanh bóng, thích hợp trang trí bàn làm việc hoặc phòng khách.",
    light: "Ưa ánh sáng gián tiếp, tránh nắng gắt chiếu trực tiếp.",
    watering: "Giữ đất hơi ẩm, tưới khi bề mặt đất bắt đầu khô.",
    care: "Đặt cây nơi thông thoáng, có thể phun sương nhẹ khi không khí khô.",
    size: "Cây chậu để bàn, cao khoảng 20–40 cm.",
  },
  {
    id: 12,
    name: "Cây May Mắn",
    price: 65000,
    category: "May Mắn",
    group: "Cây mini",
    description: "Chậu cây mini nhỏ gọn, phù hợp trang trí bàn học, bàn làm việc hoặc góc phòng.",
    light: "Đặt nơi sáng thoáng, có ánh sáng tự nhiên gián tiếp.",
    watering: "Tưới vừa đủ khi đất se khô, tránh để nước đọng dưới đáy chậu.",
    care: "Giữ cây ở nơi thông thoáng và tỉa bỏ lá khô.",
    size: "Chậu mini, phù hợp trang trí mặt bàn.",
  },
  {
    id: 13,
    name: "Cây Si Đài Loan",
    price: 150000,
    category: "Si Đài Loan",
    group: "Cây văn phòng",
    description: "Cây Si Đài Loan có thân và tán lá đẹp, thường được tạo dáng bonsai để trang trí bàn làm việc hoặc phòng khách.",
    light: "Đặt cây ở nơi sáng thoáng, có ánh sáng tự nhiên.",
    watering: "Tưới khi đất bắt đầu khô; điều chỉnh lượng nước theo điều kiện thực tế.",
    care: "Tỉa cành định kỳ để giữ dáng bonsai. Bón phân theo hướng dẫn của sản phẩm.",
    size: "Dạng bonsai, có thể uốn nắn và tạo dáng theo thời gian.",
    placement: "Bàn làm việc, kệ trang trí hoặc phòng khách.",
  },
  {
    id: 14,
    name: "Cây Tùng Tuyết",
    price: 120000,
    category: "Tùng Tuyết",
    group: "Cây phong thủy",
    description: "Tùng Tuyết có dáng cây xanh quanh năm, thích hợp trang trí bàn hoặc kệ trong nhà.",
    light: "Đặt nơi sáng thoáng, ưu tiên ánh sáng tự nhiên.",
    watering: "Tưới khi lớp đất mặt khô nhẹ, không để cây bị úng.",
    care: "Giữ cây thông thoáng, tỉa cành khô và dùng đất thoát nước tốt.",
    size: "Cây trồng chậu trang trí, kích thước tùy cây.",
  },
  {
    id: 15,
    name: "Cây Đa Búp",
    price: 90000,
    category: "Đa Búp",
    group: "Cây văn phòng",
    description: "Cây Đa Búp có lá xanh dày, bóng đẹp, phù hợp đặt ở bàn làm việc hoặc góc phòng nhiều ánh sáng.",
    light: "Ưa ánh sáng gián tiếp, tránh nắng gắt kéo dài.",
    watering: "Tưới khi bề mặt đất khô, không để chậu đọng nước.",
    care: "Lau lá định kỳ và đặt cây nơi thông thoáng.",
    size: "Cây chậu để bàn, kích thước tùy cây.",
  },
  {
    id: 16,
    name: "Cây Đuôi Công",
    price: 110000,
    category: "Đuôi Công",
    group: "Cây văn phòng",
    description: "Cây Đuôi Công gây ấn tượng với họa tiết lá độc đáo, giúp không gian trong nhà thêm sinh động.",
    light: "Ưa ánh sáng tán xạ và môi trường có độ ẩm vừa phải.",
    watering: "Giữ đất ẩm nhẹ, tránh tưới quá nhiều gây úng rễ.",
    care: "Tránh nắng trực tiếp, có thể phun sương nhẹ khi không khí khô.",
    size: "Cây trồng chậu trang trí, kích thước tùy cây.",
  },
  {
    id: 17,
    name: "Phân bón Amino đạm cá Nhật Bản",
    price: 55000,
    category: "Phân bón",
    group: "Dụng cụ chăm sóc",
    description: "Phân bón Amino giúp bổ sung dinh dưỡng cho cây trồng.",
    light: "Dùng để bổ sung dinh dưỡng cho cây.",
    watering: "Pha và sử dụng theo hướng dẫn trên bao bì sản phẩm.",
    care: "Không tự ý tăng liều lượng; bảo quản kín sau khi sử dụng.",
    size: "Đóng gói theo sản phẩm trong ảnh.",
  },
  {
    id: 18,
    name: "Bình tưới mini 15 ml",
    price: 15000,
    category: "Bình tưới",
    group: "Dụng cụ chăm sóc",
    description: "Bình tưới mini giúp tưới lượng nước nhỏ, thuận tiện chăm sóc cây để bàn.",
    light: "Phù hợp tưới cây mini và cây trồng trong chậu nhỏ.",
    watering: "Châm nước và bóp nhẹ để tưới từ từ.",
    care: "Rửa sạch, để khô sau khi dùng và bảo quản nơi thoáng mát.",
    size: "Dung tích 15 ml.",
  },
  {
    id: 19,
    name: "Bình tưới nước vòi dài",
    price: 45000,
    category: "Bình tưới",
    group: "Dụng cụ chăm sóc",
    description: "Vòi tưới dài giúp đưa nước đến gốc cây và các vị trí khó với tới.",
    light: "Dùng tưới cây trồng trong nhà và cây đặt trên kệ.",
    watering: "Rót nước chậm qua vòi để hạn chế làm xói đất.",
    care: "Đổ hết nước và vệ sinh bình sau khi sử dụng.",
    size: "Bình tưới có vòi dài.",
  },
  {
    id: 20,
    name: "Bộ dụng cụ làm vườn 3 món",
    price: 85000,
    category: "Dụng cụ làm vườn",
    group: "Dụng cụ chăm sóc",
    description: "Bộ dụng cụ cơ bản hỗ trợ xới đất, trồng và chăm sóc cây tại nhà.",
    light: "Phù hợp chăm sóc cây trồng chậu và làm vườn tại nhà.",
    watering: "Làm sạch đất bám trên dụng cụ sau khi sử dụng.",
    care: "Lau khô và cất giữ nơi khô ráo.",
    size: "Bộ gồm 3 món.",
  },
  {
    id: 21,
    name: "Găng tay làm vườn",
    price: 25000,
    category: "Găng tay",
    group: "Dụng cụ chăm sóc",
    description: "Găng tay hỗ trợ bảo vệ tay khi trồng cây, xới đất và làm vườn.",
    light: "Dùng trong các công việc trồng và chăm sóc cây.",
    watering: "Chọn kích cỡ vừa tay để thao tác thuận tiện.",
    care: "Giũ sạch đất, phơi khô sau khi dùng và cất nơi thoáng.",
    size: "Kích cỡ theo sản phẩm trong ảnh.",
  },
  {
    id: 22,
    name: "Cây Sen Đá Móng Rồng",
    price: 55000,
    category: "Sen đá",
    group: "Cây mini",
    description: "Sen đá có lá vân sọc nổi bật, thích hợp trang trí bàn học hoặc kệ sách.",
    light: "Ưa nơi sáng thoáng, có thể nhận nắng nhẹ buổi sáng.",
    watering: "Tưới khi đất khô hoàn toàn, tránh để nước đọng trong lá.",
    care: "Dùng đất thoát nước tốt và đặt chậu ở nơi thông thoáng.",
    size: "Chậu mini, cao khoảng 8–15 cm.",
  },
  {
    id: 23,
    name: "Sen Đá Chuỗi Ngọc",
    price: 60000,
    category: "Sen đá",
    group: "Cây mini",
    description: "Dáng cây nhỏ gọn, có thể đặt trên bàn hoặc trồng trong chậu treo mini.",
    light: "Đặt ở nơi sáng, tránh nắng gắt kéo dài.",
    watering: "Tưới ít khi đất đã khô; giảm lượng nước vào ngày mưa.",
    care: "Dùng giá thể thoát nước và tỉa bỏ lá khô.",
    size: "Chậu mini, thân cây có thể rủ nhẹ.",
  },
  {
    id: 24,
    name: "Xương Rồng Tai Thỏ",
    price: 50000,
    category: "Xương rồng",
    group: "Cây mini",
    description: "Xương rồng dáng độc đáo, phù hợp làm điểm nhấn cho góc bàn nhiều ánh sáng.",
    light: "Ưa sáng tự nhiên và có thể nhận nắng nhẹ.",
    watering: "Chỉ tưới khi đất khô, tránh tưới lên thân cây.",
    care: "Đặt nơi thông thoáng và sử dụng đất trồng xương rồng.",
    size: "Chậu mini, cao khoảng 10–18 cm.",
  },
  {
    id: 25,
    name: "Sen Đá Nâu",
    price: 45000,
    category: "Sen đá",
    group: "Cây mini",
    description: "Cây sen đá nhỏ với sắc lá trầm, dễ phối cùng các chậu cây mini khác.",
    light: "Ưa nơi sáng thoáng, tránh thay đổi ánh sáng đột ngột.",
    watering: "Tưới khi đất khô hoàn toàn.",
    care: "Đảm bảo chậu có lỗ thoát nước và không để đọng nước ở đĩa lót.",
    size: "Chậu mini, đường kính khoảng 6–10 cm.",
  },
  {
    id: 26,
    name: "Cây Cẩm Nhung",
    price: 65000,
    category: "Cẩm Nhung",
    group: "Cây mini",
    description: "Tán lá nhỏ có đường gân nổi bật, phù hợp trang trí bàn học và góc làm việc.",
    light: "Đặt ở nơi có ánh sáng gián tiếp, tránh nắng chiếu trực tiếp.",
    watering: "Giữ đất ẩm nhẹ, không để chậu bị úng.",
    care: "Đặt nơi thoáng mát và kiểm tra độ ẩm đất thường xuyên.",
    size: "Chậu để bàn, cao khoảng 10–15 cm.",
  },
  {
    id: 27,
    name: "Cây Lan Ý",
    price: 130000,
    category: "Lan Ý",
    group: "Cây văn phòng",
    description: "Cây lá xanh bóng, dáng gọn, phù hợp đặt ở bàn làm việc hoặc phòng khách.",
    light: "Phát triển tốt ở nơi có ánh sáng gián tiếp.",
    watering: "Tưới khi lớp đất mặt bắt đầu khô.",
    care: "Lau lá định kỳ và tránh để nước đọng lâu trong chậu.",
    size: "Cây trồng chậu, cao khoảng 25–45 cm.",
  },
  {
    id: 28,
    name: "Cây Vạn Niên Thanh",
    price: 110000,
    category: "Vạn Niên Thanh",
    group: "Cây văn phòng",
    description: "Tán lá xanh điểm màu sáng, giúp không gian làm việc thêm sinh động.",
    light: "Ưa ánh sáng tán xạ, chịu bóng nhẹ.",
    watering: "Tưới khi đất se khô, điều chỉnh theo độ ẩm trong phòng.",
    care: "Đặt cây nơi thông thoáng và lau lá khi bám bụi.",
    size: "Cây để bàn hoặc kệ, kích thước tùy chậu.",
  },
  {
    id: 29,
    name: "Cây Bàng Singapore Mini",
    price: 160000,
    category: "Bàng Singapore",
    group: "Cây văn phòng",
    description: "Dáng cây đứng với lá lớn tạo điểm nhấn gọn gàng cho góc phòng.",
    light: "Đặt ở nơi sáng, ưu tiên ánh sáng tự nhiên gián tiếp.",
    watering: "Tưới khi lớp đất mặt khô nhẹ.",
    care: "Xoay chậu định kỳ để cây nhận sáng đều và tránh gió điều hòa trực tiếp.",
    size: "Cây mini trồng chậu, cao khoảng 25–40 cm.",
  },
  {
    id: 30,
    name: "Cây Dương Xỉ Mini",
    price: 75000,
    category: "Dương Xỉ",
    group: "Cây văn phòng",
    description: "Tán lá xanh mềm, thích hợp đặt trên kệ hoặc bàn ở nơi mát.",
    light: "Ưa ánh sáng gián tiếp và môi trường thoáng mát.",
    watering: "Giữ đất ẩm vừa phải, tránh để khô kéo dài.",
    care: "Có thể phun sương nhẹ khi không khí khô; tránh nắng gắt.",
    size: "Chậu để bàn, tán rộng khoảng 15–25 cm.",
  },
  {
    id: 31,
    name: "Cây Trầu Bà Thanh Xuân",
    price: 145000,
    category: "Trầu Bà",
    group: "Cây văn phòng",
    description: "Lá xẻ tạo dáng bắt mắt, phù hợp làm cây trang trí trong nhà.",
    light: "Đặt nơi sáng gián tiếp, tránh nắng gắt.",
    watering: "Tưới khi đất bắt đầu khô nhẹ.",
    care: "Lau lá và cắt bỏ lá già để cây giữ dáng gọn.",
    size: "Cây trồng chậu, kích thước tùy cây.",
  },
  {
    id: 32,
    name: "Cây Ngũ Gia Bì",
    price: 125000,
    category: "Ngũ Gia Bì",
    group: "Cây phong thủy",
    description: "Cây có tán lá xanh gọn, thường được chọn để trang trí bàn hoặc phòng khách.",
    light: "Ưa nơi sáng thoáng, có thể chịu bóng nhẹ.",
    watering: "Tưới khi đất se khô, tránh để rễ ngập nước.",
    care: "Tỉa lá khô và đặt cây nơi thông thoáng.",
    size: "Cây trồng chậu, cao khoảng 20–40 cm.",
  },
  {
    id: 33,
    name: "Cây Kim Ngân Thắt Bím",
    price: 190000,
    category: "Kim Ngân",
    group: "Cây phong thủy",
    description: "Thân cây được tạo dáng bím, phù hợp trang trí bàn làm việc hoặc quầy tiếp khách.",
    light: "Đặt ở nơi sáng gián tiếp, tránh nắng trưa.",
    watering: "Tưới vừa đủ khi đất bắt đầu khô.",
    care: "Đảm bảo chậu thoát nước tốt và lau lá định kỳ.",
    size: "Cây chậu để bàn, cao khoảng 25–40 cm.",
  },
  {
    id: 34,
    name: "Cây Thiết Mộc Lan",
    price: 175000,
    category: "Thiết Mộc Lan",
    group: "Cây phong thủy",
    description: "Lá dài viền sáng, thích hợp tạo điểm nhấn xanh cho không gian sống.",
    light: "Phát triển tốt ở nơi sáng, tránh nắng gắt trực tiếp.",
    watering: "Tưới khi đất khô nhẹ, không để nước đọng.",
    care: "Lau lá và đặt cây tránh luồng gió điều hòa mạnh.",
    size: "Cây trồng chậu, kích thước tùy cây.",
  },
  {
    id: 35,
    name: "Cây Phát Tài Núi",
    price: 220000,
    category: "Phát Tài",
    group: "Cây phong thủy",
    description: "Dáng cây khỏe khoắn, phù hợp trang trí góc phòng hoặc sảnh nhỏ.",
    light: "Ưa ánh sáng tự nhiên gián tiếp.",
    watering: "Tưới khi đất bắt đầu khô, tránh để chậu sũng nước.",
    care: "Đặt nơi thông thoáng và lau lá khi cần.",
    size: "Cây trồng chậu, cao khoảng 30–50 cm.",
  },
  {
    id: 36,
    name: "Cây Vạn Lộc",
    price: 95000,
    category: "Vạn Lộc",
    group: "Cây phong thủy",
    description: "Lá có sắc xanh pha hồng, tạo điểm nhấn màu sắc cho bàn làm việc.",
    light: "Đặt nơi có ánh sáng tán xạ, tránh nắng gắt.",
    watering: "Tưới khi bề mặt đất bắt đầu khô.",
    care: "Giữ đất thoát nước tốt và loại bỏ lá úa.",
    size: "Chậu để bàn, cao khoảng 15–25 cm.",
  },
  {
    id: 37,
    name: "Chậu Gốm Đất Nung Mini",
    price: 35000,
    category: "Chậu cây",
    group: "Dụng cụ chăm sóc",
    description: "Chậu gốm nhỏ gọn, phù hợp trồng sen đá hoặc cây mini.",
    light: "Dùng làm chậu trồng cây trong nhà hoặc ban công.",
    watering: "Tưới cây theo nhu cầu của từng loại cây trồng.",
    care: "Rửa sạch đất bám và để chậu khô trước khi cất.",
    size: "Kích thước mini, phù hợp cây để bàn.",
  },
  {
    id: 38,
    name: "Chậu Men Mini",
    price: 45000,
    category: "Chậu cây",
    group: "Dụng cụ chăm sóc",
    description: "Chậu men nhỏ dùng trang trí bàn học, bàn làm việc hoặc kệ sách.",
    light: "Phù hợp làm chậu trồng cây mini trong nhà.",
    watering: "Chọn lượng nước phù hợp với cây và khả năng thoát nước của chậu.",
    care: "Lau sạch bề mặt chậu bằng khăn mềm.",
    size: "Chậu mini, dùng cho cây để bàn.",
  },
  {
    id: 39,
    name: "Đất Trồng Sen Đá",
    price: 30000,
    category: "Đất trồng",
    group: "Dụng cụ chăm sóc",
    description: "Giá thể trồng sen đá, hỗ trợ thoát nước cho cây trồng trong chậu.",
    light: "Dùng làm giá thể trồng hoặc thay đất cho sen đá.",
    watering: "Tưới theo nhu cầu của cây sau khi trồng.",
    care: "Bảo quản kín, để nơi khô ráo và làm theo hướng dẫn trên bao bì.",
    size: "Đóng gói theo sản phẩm.",
  },
  {
    id: 40,
    name: "Set 10 Chậu Mini Trồng Sen Đá",
    price: 65000,
    category: "Chậu cây",
    group: "Dụng cụ chăm sóc",
    description: "Bộ chậu mini tiện dụng để trồng và sắp xếp nhiều cây nhỏ.",
    light: "Phù hợp trồng sen đá và cây mini.",
    watering: "Điều chỉnh lượng nước theo từng loại cây.",
    care: "Rửa sạch chậu sau khi sử dụng và để khô trước khi cất.",
    size: "Bộ gồm 10 chậu mini.",
  },
];

const productStock: Record<number, number> = {
  1: 24,
  2: 18,
  3: 12,
  4: 15,
  5: 20,
  6: 14,
  7: 11,
  8: 13,
  9: 16,
  10: 8,
  11: 10,
  12: 25,
  13: 9,
  14: 7,
  15: 8,
  16: 12,
  17: 30,
  18: 22,
  19: 18,
  20: 12,
  21: 16,
  22: 20,
  23: 18,
  24: 14,
  25: 20,
  26: 9,
  27: 11,
  28: 10,
  29: 7,
  30: 12,
  31: 9,
  32: 8,
  33: 6,
  34: 7,
  35: 8,
  36: 10,
  37: 25,
  38: 20,
  39: 35,
  40: 18,
};

// Shared catalog data is exported alongside this page component intentionally.
// eslint-disable-next-line react-refresh/only-export-components
export const products: Product[] = productCatalog.map((product) => ({
  ...product,
  stock: productStock[product.id],
}));

// eslint-disable-next-line react-refresh/only-export-components
export const productGroups = [
  "Cây mini",
  "Cây văn phòng",
  "Cây phong thủy",
  "Dụng cụ chăm sóc",
];

// Curated favorites shown on the homepage and catalog.
// eslint-disable-next-line react-refresh/only-export-components
export const favoriteProductIds = [1, 6, 9, 11];

const productImage = (fileName: string) =>
  `/images/${encodeURIComponent(fileName)}`;

const productImages: Record<number, string> = {
  1: productImage("Cây sen đá.jpeg"),
  2: productImage("cây xương rồng.jpg"),
  3: productImage("cây kim ngân.jpeg"),
  4: productImage("Cây phát tài.jpeg"),
  5: productImage("Cây lưỡi Hổ.jpeg"),
  6: productImage("Cây kim tiền.jpeg"),
  7: productImage("Cây phú quý.jpeg"),
  8: productImage("Cây ngọc ngân.jpeg"),
  9: productImage("Cây Trầu Bà Leo.jpeg"),
  10: productImage("Cây Trầu Bà Đế Vương.jpeg"),
  11: productImage("Cây hồng môn.jpeg"),
  12: productImage("Cây mai mắn.webp"),
  13: productImage("cây si đài loan.jpeg"),
  14: productImage("cây tùng tuyết.jpeg"),
  15: productImage("cây đa búp.webp"),
  16: productImage("cây đui công.webp"),
  17: productImage("Amino- phân bón đam cá Nhật Bản.webp"),
  18: productImage("bình tưới 15ml.webp"),
  19: productImage("bình tưới nước vòi dài.webp"),
  20: productImage("Bộ dụng cụ làm vườn 3 món.webp"),
  21: productImage("găng tay làm vườn.webp"),
  22: productImage("cấy sen đá móng rồng.jpg"),
  23: productImage("Cây sen đá chuỗi ngọc.jpg"),
  24: productImage("xương rồng tai thỏ.jpg"),
  25: productImage("sen đá nâu.jpg"),
  26: productImage("cây cẩm nhug.jpg"),
  27: productImage("cây lan ý.jpg"),
  28: productImage("cây vạn niên.jpg"),
  29: productImage("cây bàng singapore.jpg"),
  30: productImage("cây đui công.webp"),
  31: productImage("trầu bà thah xuân.jpg"),
  32: productImage("Cây Ngũ Gia Bì.jpg"),
  33: productImage("Cây Kim Ngân Thắt Bím.jpg"),
  34: productImage("Cây Thiết Mộc Lan.jpg"),
  35: productImage("Cây Phát Tài Núi.jpg"),
  36: productImage("Cây Vạn Lộc.jpg"),
  37: productImage("chậu gốm đất nung bát tràng mini.webp"),
  38: productImage("chậu men xôi mini.webp"),
  39: productImage("Đất trông sen đá.jpg"),
  40: productImage("set 10 chậu mini trồng sen đá.webp"),
  41: productImage("bình tưới 15ml.webp"),
};

// eslint-disable-next-line react-refresh/only-export-components
export const getProductImage = (productId: number) => productImages[productId];

export default function SanPham() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(() => {
    const requestedGroup = new URLSearchParams(window.location.search).get("group");
    return productGroups.find((group) => group === requestedGroup) ?? "all";
  });
  const [salesState] = useState(() => {
    try {
      return { counts: loadProductSales(), error: "" };
    } catch (error) {
      console.error("Không thể thống kê lượt bán sản phẩm:", error);
      return {
        counts: {} as Record<number, number>,
        error: "Không thể tải lượt bán từ lịch sử đơn hàng.",
      };
    }
  });
  const bestSellerIds = useMemo(
    () =>
      new Set(
        Object.entries(salesState.counts)
          .filter(([, count]) => count > 0)
          .sort(([, countA], [, countB]) => countB - countA)
          .slice(0, 4)
          .map(([id]) => Number(id))
      ),
    [salesState.counts]
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(normalizedSearch);

      const matchesCategory =
        category === "all" || item.group === category;

      return matchesSearch && matchesCategory;
    });
  }, [category, search]);

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f7f2] text-[#27352c]">
      <header className="sticky top-0 z-40 border-b border-[#e7e5dc] bg-[#f8f7f2]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a href="/" className="flex items-center gap-3" aria-label="Green Garden - Trang chủ">
            <img src="/images/logo%20website.jpg" alt="" className="h-12 w-12 shrink-0 rounded-full bg-white object-contain" />
            <span>
              <span className="block font-serif text-lg font-semibold tracking-wide text-[#263b2d]">GREEN GARDEN</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-[#7b8177]">Cây xanh cho nhà mình</span>
            </span>
          </a>
          <nav aria-label="Điều hướng chính" className="flex flex-wrap items-center gap-3 text-sm sm:gap-6">
            <a href="/" className="text-[#59645b] transition hover:text-[#314c39]">
              Trang chủ
            </a>
            <a href="/san-pham" aria-current="page" className="font-semibold text-[#314c39]">
              Sản phẩm
            </a>

            <a href="/gioi-thieu" className="text-[#59645b] transition hover:text-[#314c39]">
              Về chúng tôi
            </a>

            <a href="/lien-he" className="text-[#59645b] transition hover:text-[#314c39]">
              Liên hệ
            </a>
            <CartMenu />
            <AccountMenu />
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-12 sm:px-8 md:py-16">
        <div className="mb-9 flex flex-col justify-between gap-5 border-b border-[#e2e0d7] pb-8 md:flex-row md:items-end">
          <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#78836f]">GREEN GARDEN · VĨNH LONG</p>
          <h1 className="font-serif text-4xl text-[#263b2d] sm:text-5xl">
          Thêm màu xanh cho không gian của bạn
          </h1>
          <p className="mt-3 max-w-xl leading-7 text-[#687168]">
            Chọn một người bạn xanh nhỏ cho bàn làm việc, kệ sách hoặc góc phòng.
          </p>
          </div>
          <p className="text-sm text-[#7b8177]">Được chọn lọc để dễ chăm mỗi ngày.</p>
        </div>

        <div className="mb-7 flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">
              Tìm kiếm sản phẩm
            </label>

            <input
              id="search"
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-[#deded4] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#9a9e93] focus:border-[#6f866f] focus:ring-2 focus:ring-[#e5e9df]"
            />
          </div>
          <div>
            <label htmlFor="category" className="sr-only">
              Danh mục sản phẩm
            </label>

            <select
              id="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-xl border border-[#deded4] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#6f866f] focus:ring-2 focus:ring-[#e5e9df]"
            >
              <option value="all">Tất cả nhóm sản phẩm</option>

              {productGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p aria-live="polite" className="mb-4 text-xs uppercase tracking-[0.12em] text-[#85887e]">
          Tìm thấy {filteredProducts.length} sản phẩm
        </p>
        {salesState.error && (
          <p role="alert" className="mb-4 text-sm text-red-700">{salesState.error}</p>
        )}

        {/* Danh sách sản phẩm */}
        {filteredProducts.length > 0 ? (
          <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <TheSanPham
                key={product.id}
                product={product}
                isFavorite={favoriteProductIds.includes(product.id)}
                salesCount={
                  salesState.error
                    ? undefined
                    : salesState.counts[product.id] ?? 0
                }
                isBestSeller={bestSellerIds.has(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#d6d8ce] bg-white p-12 text-center text-[#747a70]">
            Không tìm thấy sản phẩm phù hợp.
          </div>
        )}
      </main>

      <footer className="mt-16 bg-[#24382b] text-[#e7e9e1]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-3">
          <div>
            <h2 className="font-serif text-xl">GREEN GARDEN</h2>
            <p className="mt-3 text-sm text-[#b8c2b6]">Thêm sắc xanh cho không gian sống.</p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b8c2b6]">Người thực hiện</h2>
            <div className="mt-3 space-y-1 text-sm">
              <p>Phan Minh Anh</p>
              <p>Lớp: DA24TTB</p>
              <p>MSSV: 110124003</p>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b8c2b6]">Liên hệ</h2>
            <div className="mt-3 space-y-2 text-sm">
              <a href="tel:0888898646" className="block hover:text-white">0888898646</a>
              <a href="mailto:mphan6754@gmail.com" className="block break-all hover:text-white">mphan6754@gmail.com</a>
              <p>Vĩnh Long, Việt Nam</p>
            </div>
          </div>
        </div>
        <p className="mx-auto max-w-7xl border-t border-white/10 px-5 py-5 text-xs text-[#aeb9ac] sm:px-8">
          © {new Date().getFullYear()} GREEN GARDEN
        </p>
      </footer>
    </div>
  );
}
