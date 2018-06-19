import mritopng

# Convert a since file
#mritopng.convert_file('E:/setups/MRI/MR/1.2.840.113619.2.5.1762583153.215519.978957063.79/1.2.840.113619.2.5.1762583153.215519.978957063.80.dcm', 'E:/setups/MRI/MRI_out/output.png')

# Convert a whole folder recursively
mritopng.convert_folder('E:/setups/MRI/MRI_sample/', 'E:/setups/MRI/MRI_out1/')