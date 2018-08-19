#!/usr/bin/env python
from glob import glob
import cv2
import os
all_pngs = glob("E:/examples/python/tensorflow-image-detection-master/training_dataset/brain_with_rotated_images/rotated_images_180_again_once_after_90/29_mri_images/*.png")
target_path = "E:/examples/python/tensorflow-image-detection-master/training_dataset/img_disease"#185
#target_path = "E:/examples/python/tensorflow-image-detection-master/training_dataset/img_normal"#121
counter = 185
for j in all_pngs:
    img = cv2.imread(j)
    cv2.imwrite(os.path.join(target_path, "img" + str(counter) + ".jpg"), img)
    print("img"+str(counter)+".jpg")
    #print(j)
    counter+=1
