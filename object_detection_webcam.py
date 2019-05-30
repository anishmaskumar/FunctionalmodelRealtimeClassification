
import numpy as np
import os
import six.moves.urllib as urllib
import sys
import tarfile
import tensorflow as tf
import zipfile
from collections import defaultdict
from io import StringIO
from matplotlib import pyplot as plt
#from PIL import Image
from keras.preprocessing import image
import cv2
from utils import label_map_util
from utils import visualization_utils as vis_util
import datetime
#from Prediction import trainCNN
from keras.models import load_model
from keras.initializers import glorot_uniform
from keras.utils import CustomObjectScope
from tensorflow.keras import layers
from TrainTensorflowkeras import trainmodel

# # Model preparation 
# Any model exported using the `export_inference_graph.py` tool can be loaded here simply by changing `PATH_TO_CKPT` to point to a new .pb file.  
# By default we use an "SSD with Mobilenet" model here. See the [detection model zoo](https://github.com/tensorflow/models/blob/master/object_detection/g3doc/detection_model_zoo.md) for a list of other models that can be run out-of-the-box with varying speeds and accuracies.

# What model to download.
###########Model for Detectiomn#############################
############################################################
class ObjectDetection:

    def main(self):

        MODEL_NAME = 'ssd_mobilenet_v1_coco_11_06_2017'
        MODEL_FILE = MODEL_NAME + '.tar.gz'
        DOWNLOAD_BASE = 'http://download.tensorflow.org/models/object_detection/'

        # Path to frozen detection graph. This is the actual model that is used for the object detection.
        PATH_TO_CKPT = MODEL_NAME + '/frozen_inference_graph.pb'

        # List of the strings that is used to add correct label for each box.
        PATH_TO_LABELS = os.path.join('data', 'mscoco_label_map.pbtxt')

        NUM_CLASSES = 90

        # ## Download Model

        if not os.path.exists(MODEL_NAME + '/frozen_inference_graph.pb'):
            print ('Downloading the model')
            opener = urllib.request.URLopener()
            opener.retrieve(DOWNLOAD_BASE + MODEL_FILE, MODEL_FILE)
            tar_file = tarfile.open(MODEL_FILE)
            for file in tar_file.getmembers():
                file_name = os.path.basename(file.name)
                if 'frozen_inference_graph.pb' in file_name:
                    tar_file.extract(file, os.getcwd())
                    print ('Download complete!!!\n')
        else:
            print('Model already exists!!\n')

        # ## Load a (frozen) Tensorflow model into memory.
        global detection_graph
        detection_graph = tf.Graph()
        with detection_graph.as_default():
            od_graph_def = tf.GraphDef()
            with tf.gfile.GFile(PATH_TO_CKPT, 'rb') as fid:
                serialized_graph = fid.read()
                od_graph_def.ParseFromString(serialized_graph)
                tf.import_graph_def(od_graph_def, name='')


        # ## Loading label map
        # Label maps map indices to category names, so that when our convolution network predicts `5`, we know that this corresponds to `airplane`.  Here we use internal utility functions, but anything that returns a dictionary mapping integers to appropriate string labels would be fine
        global label_map
        label_map = label_map_util.load_labelmap(PATH_TO_LABELS)
        global categories
        categories = label_map_util.convert_label_map_to_categories(label_map, max_num_classes=NUM_CLASSES, use_display_name=True)
        global category_index
        category_index = label_map_util.create_category_index(categories)



    def train(self):
        ###########Train Our Model Usig CNN############################
      
        try:
            print('Training starts at ====> ' + datetime.datetime.now().strftime('%H:%M:%S') + '\n\n')
	    if not os.path.exists('models/model1.h5'):	
            	 trainmodel()
            print('\nTraining Ends at   ====> ' + datetime.datetime.now().strftime('%H:%M:%S') + '\n\n')
            #load_Ourmodel()
        except Exception as ex:
            print(ex)


    ##2 hrs time##########

    ############Detection using webcamera#########################
   

    def ObjectDetection(self):
        # intializing the web camera device
        global cap
        try:
            cap = cv2.VideoCapture(0)
        except Exception as ex:
            print("No Webcam detected###\n", ex)

        # Running the tensorflow session
        with detection_graph.as_default():
            with tf.Session(graph=detection_graph) as sess:
                ret = True

               # Ourmodel = load_model("models/model1.h5")
		with CustomObjectScope({'GlorotUniform': glorot_uniform()}):
			Ourmodel = load_model('models/model1.h5')
                while (ret):
                    ret, image_np = cap.read()
                    # Expand dimensions since the model expects images to have shape: [1, None, None, 3]
                    image_np_expanded = np.expand_dims(image_np, axis=0)
                    image_tensor = detection_graph.get_tensor_by_name('image_tensor:0')
                    # Each box represents a part of the image where a particular object was detected.
                    boxes = detection_graph.get_tensor_by_name('detection_boxes:0')

                    # Each score represent how level of confidence for each of the objects.
                    # Score is shown on the result image, together with the class label.
                    scores = detection_graph.get_tensor_by_name('detection_scores:0')

                    classes = detection_graph.get_tensor_by_name('detection_classes:0')

                    num_detections = detection_graph.get_tensor_by_name('num_detections:0')

                    # Actual detection.
                    (boxes, scores, classes, num_detections) = sess.run([boxes, scores, classes, num_detections],
                                                                        feed_dict={image_tensor: image_np_expanded})
                    # Visualization of the results of a detection.
                    x = np.squeeze(classes).astype(np.int32)
                    for i in range(min(20, boxes.shape[0])):
                        if x[i] in category_index.keys():
                            class_name = category_index[x[i]]['name']
                         #   print(class_name)
                    vis_util.visualize_boxes_and_labels_on_image_array(

                        image_np,
                        np.squeeze(boxes),
                        np.squeeze(classes).astype(np.int32),
                        np.squeeze(scores),
                        category_index,
                        use_normalized_coordinates=True,
                        line_thickness=8)
                    if os.path.exists( os.getcwd() +'/Working_Directory/' + 'testImage' + '.jpeg'):
                        test_image = image.load_img("Working_Directory/testImage.jpeg", target_size=(192, 192))
                        # test_image = image.resize((150, 150))
                    #    print(test_image)
                        test_image = np.expand_dims(test_image, axis=0)
                        result = Ourmodel.predict(test_image)
                        self.predictBottleClass(result,test_image)
                    # plt.figure(figsize=IMAGE_SIZE)
                    #      plt.imshow(image_np)
                    # cv2.imshow('image',cv2.resize(image_np,(1280,960)))
                    cv2.imshow('image', image_np)
                    if cv2.waitKey(1) >= 0:
                        break
                cv2.waitKey(0)
                cv2.destroyAllWindows()


    def predictBottleClass(self,result,test_image):
        try:
            prediction=''
            if result[0][0] == 1:
                prediction = 'Bottle is defect'
                self.WritetoFile(prediction)
            elif result[0][1] == 1:
                prediction = 'Bottle is perfect'
            elif result[0][2] == 1:
                prediction = 'Bottle have no cap'
                self.WritetoFile(prediction)
            # result.append(prediction)
            print(prediction)
            try:
                f = open("foo.csv", 'w')
                f.write( prediction)
                f.close()
            except Exception as e:
                print("error", e)
            os.remove(os.getcwd() + '/Working_Directory/' + 'testImage' + '.jpeg')

        except Exception as ex:
            print('Exception : ', ex)

        # train_generator.class_indices
    def WritetoFile(self,prediction):
        test_image = image.load_img("Working_Directory/testImage.jpeg")
      #  print("Writing image...")
        test_image.save(
                     os.getcwd() + '/Testing_Directory/image_' +prediction+ str(datetime.datetime.now()) + '.jpeg',
                    "JPEG",
                     quality=80, optimize=True, progressive=True)


newObj = ObjectDetection()
newObj.main()
newObj.train()
newObj.ObjectDetection()
