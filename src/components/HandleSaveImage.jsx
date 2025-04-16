import html2canvas from 'html2canvas';
import { toast } from "react-toastify";

export default function handleSaveImage() {
  const memo = document.getElementById('memo-board');
  if (!memo) {
    alert("저장할 메모판이 없어요!");
    return;
  }
  html2canvas(memo).then((canvas) => {
    const link = document.createElement('a');
    link.download = 'sticker-memo.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });

  toast.success("💾 이미지가 저장되었어요!")
}
