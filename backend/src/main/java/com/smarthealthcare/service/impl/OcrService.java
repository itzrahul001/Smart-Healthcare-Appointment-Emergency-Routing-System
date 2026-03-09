package com.smarthealthcare.service.impl;

import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@Service
public class OcrService {

    public String extractTextFromImage(MultipartFile file) {
        ITesseract tesseract = new Tesseract();

        // Set the tessdata path - you need to download trained data
        // For now, assuming it's in the project root or system path
        tesseract.setDatapath("src/main/resources/tessdata");
        tesseract.setLanguage("eng");

        try {
            File convFile = convert(file);
            String text = tesseract.doOCR(convFile);
            convFile.delete(); // cleanup
            return text;
        } catch (TesseractException | IOException e) {
            e.printStackTrace();
            return "Error extracting text: " + e.getMessage();
        }
    }

    private File convert(MultipartFile file) throws IOException {
        File convFile = new File(file.getOriginalFilename());
        convFile.createNewFile();
        FileOutputStream fos = new FileOutputStream(convFile);
        fos.write(file.getBytes());
        fos.close();
        return convFile;
    }
}
