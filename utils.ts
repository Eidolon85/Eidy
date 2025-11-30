export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove data:image/jpeg;base64, prefix if needed for raw data, 
        // but typically we keep it for preview and strip it for API
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

export const urlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return await fileToBase64(new File([blob], "image.png", { type: blob.type }));
  } catch (error) {
    console.error("Error converting URL to Base64:", error);
    throw error;
  }
};

export const stripBase64Prefix = (base64: string): string => {
  return base64.replace(/^data:image\/[a-z]+;base64,/, "");
};
