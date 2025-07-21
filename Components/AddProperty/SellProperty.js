import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { AuthContext } from '../../context/AuthContext';
import propertyConfigData from '../../assets/Data/propertyConfig.json';

const { residential, commercial, step3Fields } = propertyConfigData;

const SellProperty = () => {
  const { user, userToken } = useContext(AuthContext);
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [click, setClick] = useState(false);
  const [activeButton, setActiveButton] = useState('');
  const [activeCommercial, setActiveCommercial] = useState('');
  const [active, setActive] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [message, setMessage] = useState('');
  const [errorModal, setErrorModal] = useState({ isOpen: false, messages: [] });
  const [storedata, setStoreData] = useState({ phone: '', person: '' });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState({
    bhk: '',
    kothi_story_type: '',
    floor_no: '',
    total_floors: '',
    bedrooms: '',
    bathrooms: '',
    land: '',
    built: '',
    additional: '',
    furnishing_status: '',
    carpet: '',
    property_type: '',
    property_age: '',
    gated_community: '',
    sqft: '',
    has_lift: '',
    parking_available: '',
    width_length: '',
    road_width: '',
    commercial_useType: '',
    shutters_count: '',
    roof_height: '',
    loading_bay: '',
    city: '',
    address: '',
    landmark: '',
    zip_code: '',
    map_link: '',
    budget: '',
    construction_status: '',
    description: '',
    name: '',
    direction: '',
    facing: '',
    in_society: '',
    amenities: [],
    hospital_type: '',
    additional_value: '',
    floor_available: '',
    medical_facilities: [],
    hospital_license: '',
    possession_status: '',
    image_one: '',
    image_two: '',
    image_three: '',
    image_four: '',
  });

  const isLoggedIn = () => {
    return !!userToken && !!user;
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (isLoggedIn()) {
        setStoreData({
          phone: user?.phone || '',
          person: user?.name || '',
        });
      } else {
        setStoreData({ phone: '', person: '' });
      }
    };

    checkAuth();
  }, [userToken, user]);

  const handleNewData = (name, value) => {
    setStoreData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePropertyDetailsChange = (name, value, type, checked) => {
    if (type === 'checkbox') {
      setPropertyDetails((prev) => {
        const currentValues = Array.isArray(prev[name]) ? prev[name] : [];
        return {
          ...prev,
          [name]: checked
            ? [...currentValues, value]
            : currentValues.filter((item) => item !== value),
        };
      });
    } else {
      setPropertyDetails((prev) => ({
        ...prev,
        [name]: type === 'radio' ? value : value,
      }));
    }
  };

  const handleFileChange = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.7,
      selectionLimit: 4,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        setErrorModal({
          isOpen: true,
          messages: [`Error selecting images: ${response.errorMessage}`],
        });
        return;
      }

      const assets = response.assets || [];
      const validFiles = assets.filter((asset) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (!validTypes.includes(asset.type)) {
          setErrorModal({
            isOpen: true,
            messages: [`Invalid file type for ${asset.fileName}. Only JPG, JPEG, and PNG are allowed.`],
          });
          return false;
        }
        if (asset.fileSize > maxSize) {
          setErrorModal({
            isOpen: true,
            messages: [`File ${asset.fileName} is too large. Maximum size is 5MB.`],
          });
          return false;
        }
        return true;
      });

      const limitedFiles = validFiles.slice(0, 4);
      setSelectedFiles(limitedFiles);
      setImagePreviews(limitedFiles.map((asset) => asset.uri));
      setPropertyDetails((prev) => ({
        ...prev,
        image_one: limitedFiles[0]?.fileName || '',
        image_two: limitedFiles[1]?.fileName || '',
        image_three: limitedFiles[2]?.fileName || '',
        image_four: limitedFiles[3]?.fileName || '',
      }));
    });
  };

  const handleClickButton = (type) => setActive(type);
  const handleCommercial = (type) => setActiveCommercial(type);
  const handlePropertyType = (type) => setActiveButton(type);
  const handleOptionChange = (value) => setSelectedOption(value);

  const validateStep = async () => {
    setMessage('');
    setClick(true);
    const errors = [];

    if (step === 1) {
      if (!active) {
        errors.push('Please select a property action (Sell or Rent/Lease)');
      }
      if (selectedOption === 'residential' && !activeButton) {
        errors.push('Please select a residential property type');
      }
      if (selectedOption === 'commercial' && !activeCommercial) {
        errors.push('Please select a commercial property type');
      }
      if (!isLoggedIn()) {
        if (!storedata.phone || !/^\d{10}$/.test(storedata.phone)) {
          errors.push('Please enter a valid 10-digit phone number');
        }
        if (!storedata.person) {
          errors.push('Please enter your name');
        }
      }
      const fields = selectedOption === 'residential'
        ? residential[activeButton]?.step1 || []
        : commercial[activeCommercial]?.step1 || [];
      fields.forEach((field) => {
        if (
          field.required &&
          !propertyDetails[field.name] &&
          (!field.showIf || propertyDetails[field.showIf?.field] === field.showIf?.value)
        ) {
          errors.push(`Please fill in the required ${field.label} field`);
        }
      });
    } else if (step === 2) {
      const fields = selectedOption === 'residential'
        ? residential[activeButton]?.step2 || []
        : commercial[activeCommercial]?.step2 || [];
      fields.forEach((field) => {
        if (
          field.required &&
          !propertyDetails[field.name] &&
          (!field.showIf || propertyDetails[field.showIf?.field] === field.showIf?.value)
        ) {
          errors.push(`Please fill in the required ${field.label} field`);
        }
      });
    } else if (step === 3) {
      const requiredFields = step3Fields.filter((field) => field.required);
      requiredFields.forEach((field) => {
        if (!propertyDetails[field.name]) {
          errors.push(`Please fill in the required ${field.label} field`);
        }
      });
      if (selectedFiles.length === 0) {
        errors.push('Please upload at least one image');
      }
    }

    if (errors.length > 0) {
      setErrorModal({ isOpen: true, messages: errors });
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (await validateStep()) {
      setClick(false);
      setMessage('');
      setErrorModal({ isOpen: false, messages: [] });
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setClick(false);
    setMessage('');
    setErrorModal({ isOpen: false, messages: [] });
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setClick(true);
    setMessage('');
    setIsLoading(true);

    const finalPhone = isLoggedIn() ? user?.phone || '' : storedata.phone;
    const finalPerson = isLoggedIn() ? user?.name || '' : storedata.person;

    if (!finalPhone || !/^\d{10}$/.test(finalPhone)) {
      setErrorModal({
        isOpen: true,
        messages: ['Please enter a valid 10-digit phone number'],
      });
      setIsLoading(false);
      return;
    }
    if (!finalPerson) {
      setErrorModal({
        isOpen: true,
        messages: ['Please enter your name'],
      });
      setIsLoading(false);
      return;
    }

    const property_type = selectedOption === 'residential' ? activeButton : activeCommercial;
    const category = selectedOption;
    const property_for = active;

    if (!property_type || !category || !property_for) {
      setErrorModal({
        isOpen: true,
        messages: ['Please ensure all property details are selected'],
      });
      setIsLoading(false);
      return;
    }

    const payload = {
      property_for,
      property_type,
      category,
      name: propertyDetails.name,
      description: propertyDetails.description,
      budget: parseFloat(propertyDetails.budget) || 0,
      budget_in_words: propertyDetails.budget
        ? `${propertyDetails.budget} ${propertyDetails.budget_unit || 'Cr'}`
        : '',
      phone: finalPhone,
      person: finalPerson,
      city: propertyDetails.city,
      address: propertyDetails.address,
      zip_code: propertyDetails.zip_code,
      map_link: propertyDetails.map_link,
      bhk: propertyDetails.bhk,
      bedrooms: propertyDetails.bedrooms,
      bathrooms: propertyDetails.bathrooms,
      carpet: propertyDetails.carpet
        ? `${propertyDetails.carpet} ${propertyDetails.carpet_unit || 'sqft'}`
        : '',
      built: propertyDetails.built
        ? `${propertyDetails.built} ${propertyDetails.built_unit || 'sqft'}`
        : '',
      land: propertyDetails.land
        ? `${propertyDetails.land} ${propertyDetails.land_unit || 'sqft'}`
        : '',
      additional: propertyDetails.additional,
      additional_value: propertyDetails.additional_value,
      amenities: JSON.stringify(propertyDetails.amenities),
      image_one: propertyDetails.image_one,
      image_two: propertyDetails.image_two,
      image_three: propertyDetails.image_three,
      image_four: propertyDetails.image_four,
      floor_no: parseInt(propertyDetails.floor_no) || null,
      total_floors: parseInt(propertyDetails.total_floors) || null,
      property_age: propertyDetails.property_age,
      kothi_story_type: propertyDetails.kothi_story_type,
      furnishing_status: propertyDetails.furnishing_status,
      gated_community: propertyDetails.gated_community === 'yes' ? 1 : 0,
      has_lift: propertyDetails.has_lift === 'yes' ? 1 : 0,
      parking_available: propertyDetails.parking_available === 'yes' ? 1 : 0,
      width_length: propertyDetails.width_length,
      road_width: propertyDetails.road_width,
      commercial_useType: propertyDetails.commercial_useType,
      shutters_count: parseInt(propertyDetails.shutters_count) || null,
      roof_height: propertyDetails.roof_height,
      loading_bay: propertyDetails.loading_bay === 'yes' ? 1 : 0,
      landmark: propertyDetails.landmark,
      direction: propertyDetails.direction,
      facing: propertyDetails.facing,
      in_society: propertyDetails.in_society,
      hospital_type: propertyDetails.hospital_type,
      floor_available: propertyDetails.floor_available,
      medical_facilities: JSON.stringify(propertyDetails.medical_facilities),
      hospital_license: propertyDetails.hospital_license === 'yes' ? 1 : 0,
      possession_status: propertyDetails.possession_status,
      construction_status: propertyDetails.construction_status,
      image_files: selectedFiles.map((file) => file.fileName),
    };

    try {
      if (!userToken) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await fetch('https://api.example.com/api/Properties/addProperty/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          await AsyncStorage.multiRemove(['token', 'phone', 'person']);
          navigation.navigate('Success');
          throw new Error('Unauthorized: Please log in again');
        }
        throw new Error(data.message || 'Something went wrong.');
      }

      setMessage(data.message || 'Property submitted successfully!');
      navigation.navigate('Success');
    } catch (error) {
      setErrorModal({
        isOpen: true,
        messages: [error.message || 'An error occurred. Please try again.'],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setErrorModal({ isOpen: false, messages: [] });
  };

  const renderField = (field) => {
    const { name, label, type, placeholder, options, option, required, showIf } = field;

    if (showIf && propertyDetails[showIf.field] !== showIf.value) {
      return null;
    }

    if (type === 'select') {
      return (
        <View key={name} style={styles.fieldContainer}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}>*</Text>}
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={propertyDetails[name] || ''}
              onValueChange={(value) => handlePropertyDetailsChange(name, value, type)}
              style={styles.picker}
            >
              <Picker.Item label={placeholder || `Select ${label}`} value="" />
              {options.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
        </View>
      );
    } else if (type === 'radio') {
      return (
        <View key={name} style={styles.fieldContainer}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}>*</Text>}
          </Text>
          <View style={styles.radioContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => handlePropertyDetailsChange(name, option, type)}
                style={styles.radioOption}
              >
                <View
                  style={[
                    styles.radio,
                    propertyDetails[name] === option && styles.radioSelected,
                  ]}
                />
                <Text style={styles.radioText}>{option.charAt(0).toUpperCase() + option.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    } else if (type === 'checkbox') {
      return (
        <View key={name} style={styles.fieldContainer}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}>*</Text>}
          </Text>
          <View style={styles.checkboxGrid}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() =>
                  handlePropertyDetailsChange(name, option, type, !propertyDetails[name]?.includes(option))
                }
                style={styles.checkboxOption}
              >
                <View
                  style={[
                    styles.checkbox,
                    propertyDetails[name]?.includes(option) && styles.checkboxSelected,
                  ]}
                />
                <Text style={styles.checkboxText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    } else if (type === 'selectOrText') {
      return (
        <View key={name} style={styles.fieldContainer}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}>*</Text>}
          </Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, option && styles.inputWithUnit]}
              value={propertyDetails[name] || ''}
              onChangeText={(value) => handlePropertyDetailsChange(name, value, type)}
              placeholder={placeholder}
              keyboardType={type === 'selectOrText' ? 'numeric' : 'default'}
            />
            {option && (
              <View style={styles.unitPickerContainer}>
                <Picker
                  selectedValue={propertyDetails[`${name}_unit`] || option[0]}
                  onValueChange={(value) => handlePropertyDetailsChange(`${name}_unit`, value, type)}
                  style={styles.unitPicker}
                >
                  {option.map((unit) => (
                    <Picker.Item key={unit} label={unit} value={unit} />
                  ))}
                </Picker>
              </View>
            )}
          </View>
        </View>
      );
    } else if (type === 'textarea') {
      return (
        <View key={name} style={styles.fieldContainer}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}>*</Text>}
          </Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={propertyDetails[name] || ''}
            onChangeText={(value) => handlePropertyDetailsChange(name, value, type)}
            placeholder={placeholder}
            multiline
            numberOfLines={4}
          />
        </View>
      );
    } else if (type === 'file') {
      return (
        <View key={name} style={styles.fieldContainer}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}>*</Text>}
          </Text>
          <TouchableOpacity
            onPress={handleFileChange}
            style={styles.fileButton}
          >
            <Text style={styles.fileButtonText}>Choose Images (Max 4)</Text>
          </TouchableOpacity>
          {imagePreviews.length > 0 && (
            <View style={styles.previewContainer}>
              <Text style={styles.previewText}>Image Previews ({imagePreviews.length}/4):</Text>
              <View style={styles.previewGrid}>
                {imagePreviews.map((preview, index) => (
                  <View key={index} style={styles.previewItem}>
                    <Image
                      source={{ uri: preview }}
                      style={styles.previewImage}
                    />
                    {index === 0 && (
                      <Text style={styles.mainImageLabel}>Main</Text>
                    )}
                    <Text style={styles.previewFileName} numberOfLines={1}>
                      {selectedFiles[index]?.fileName || ''}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          {selectedFiles.length > 0 && (
            <View style={styles.selectedFilesContainer}>
              <Text style={styles.selectedFilesText}>Selected files:</Text>
              {selectedFiles.map((file, index) => (
                <Text key={index} style={styles.selectedFileText}>
                  {index === 0 ? `${file.fileName} (Main Image)` : file.fileName}
                </Text>
              ))}
            </View>
          )}
        </View>
      );
    } else {
      return (
        <View key={name} style={styles.fieldContainer}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}>*</Text>}
          </Text>
          <TextInput
            style={styles.input}
            value={propertyDetails[name] || ''}
            onChangeText={(value) => handlePropertyDetailsChange(name, value, type)}
            placeholder={placeholder}
            keyboardType={name === 'phone' || name === 'zip_code' ? 'numeric' : 'default'}
            maxLength={name === 'phone' ? 10 : undefined}
          />
        </View>
      );
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View>
            {!isLoggedIn() && (
              <>
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>
                    Phone Number <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={storedata.phone}
                    onChangeText={(value) => handleNewData('phone', value)}
                    placeholder="Enter 10-digit phone number"
                    keyboardType="numeric"
                    maxLength={10}
                  />
                </View>
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>
                    Name <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={storedata.person}
                    onChangeText={(value) => handleNewData('person', value)}
                    placeholder="Enter your name"
                  />
                </View>
              </>
            )}
            <View style={styles.buttonGrid}>
              <TouchableOpacity
                onPress={() => handleClickButton('Sell')}
                style={[
                  styles.actionButton,
                  active === 'Sell' && styles.selectedActionButton,
                ]}
              >
                <Text
                  style={[
                    styles.actionButtonText,
                    active === 'Sell' && styles.selectedActionButtonText,
                  ]}
                >
                  Sell
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleClickButton('Rent/Lease')}
                style={[
                  styles.actionButton,
                  active === 'Rent/Lease' && styles.selectedActionButton,
                ]}
              >
                <Text
                  style={[
                    styles.actionButtonText,
                    active === 'Rent/Lease' && styles.selectedActionButtonText,
                  ]}
                >
                  Rent/Lease
                </Text>
              </TouchableOpacity>
            </View>
            {click && active === '' && (
              <Text style={styles.errorText}>
                Please select a property action (Sell or Rent/Lease)
              </Text>
            )}
            <View style={styles.radioContainer}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => handleOptionChange('residential')}
              >
                <View style={[styles.radio, selectedOption === 'residential' && styles.radioSelected]} />
                <Text style={styles.radioText}>Residential</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => handleOptionChange('commercial')}
              >
                <View style={[styles.radio, selectedOption === 'commercial' && styles.radioSelected]} />
                <Text style={styles.radioText}>Commercial</Text>
              </TouchableOpacity>
            </View>
            {selectedOption === 'residential' && (
              <>
                <View style={styles.buttonGrid}>
                  {Object.keys(residential).map((type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => handlePropertyType(type)}
                      style={[
                        styles.propertyButton,
                        activeButton === type && styles.selectedPropertyButton,
                      ]}
                    >
                      <Text
                        style={[
                          styles.propertyButtonText,
                          activeButton === type && styles.selectedPropertyButtonText,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {click && selectedOption === 'residential' && activeButton === '' && (
                  <Text style={styles.errorText}>
                    Please select a residential property type
                  </Text>
                )}
                {activeButton && residential[activeButton]?.step1 && (
                  <View style={styles.fieldGrid}>
                    {residential[activeButton].step1.map(renderField)}
                  </View>
                )}
              </>
            )}
            {selectedOption === 'commercial' && (
              <>
                <View style={styles.buttonGrid}>
                  {Object.keys(commercial).map((type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => handleCommercial(type)}
                      style={[
                        styles.propertyButton,
                        activeCommercial === type && styles.selectedPropertyButton,
                      ]}
                    >
                      <Text
                        style={[
                          styles.propertyButtonText,
                          activeCommercial === type && styles.selectedPropertyButtonText,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {click && selectedOption === 'commercial' && activeCommercial === '' && (
                  <Text style={styles.errorText}>
                    Please select a commercial property type
                  </Text>
                )}
                {activeCommercial && commercial[activeCommercial]?.step1 && (
                  <View style={styles.fieldGrid}>
                    {commercial[activeCommercial].step1.map(renderField)}
                  </View>
                )}
              </>
            )}
          </View>
        );
      case 2:
        return (
          <View>
            {selectedOption === 'residential' && activeButton && residential[activeButton]?.step2 && (
              <View style={styles.fieldGrid}>
                {residential[activeButton].step2.map(renderField)}
              </View>
            )}
            {selectedOption === 'commercial' && activeCommercial && commercial[activeCommercial]?.step2 && (
              <View style={styles.fieldGrid}>
                {commercial[activeCommercial].step2.map(renderField)}
              </View>
            )}
          </View>
        );
      case 3:
        return (
          <View style={styles.fieldGrid}>
            {step3Fields.map(renderField)}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Upload Images (Max 4, First image will be main image) <Text style={styles.required}>*</Text>
              </Text>
              {renderField({
                name: 'images',
                label: 'Upload Images (Max 4, First image will be main image)',
                type: 'file',
                required: true,
              })}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {message && (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        )}
        <Modal isVisible={errorModal.isOpen} onBackdropPress={closeModal}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Validation Errors</Text>
            {errorModal.messages.map((msg, index) => (
              <Text key={index} style={styles.modalMessage}>
                • {msg}
              </Text>
            ))}
            <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <View style={styles.progressContainer}>
          <View style={styles.progressStep}>
            <View
              style={[
                styles.progressIcon,
                step >= 1 && styles.progressIconActive,
              ]}
            >
              <Text style={styles.progressIconText}>1</Text>
            </View>
            <Text style={[styles.progressText, step >= 1 && styles.progressTextActive]}>
              Property Category & Structure
            </Text>
          </View>
          <View style={styles.progressStep}>
            <View
              style={[
                styles.progressIcon,
                step >= 2 && styles.progressIconActive,
              ]}
            >
              <Text style={styles.progressIconText}>2</Text>
            </View>
            <Text style={[styles.progressText, step >= 2 && styles.progressTextActive]}>
              Area, Construction & Community Details
            </Text>
          </View>
          <View style={styles.progressStep}>
            <View
              style={[
                styles.progressIcon,
                step >= 3 && styles.progressIconActive,
              ]}
            >
              <Text style={styles.progressIconText}>3</Text>
            </View>
            <Text style={[styles.progressText, step >= 3 && styles.progressTextActive]}>
              Confirm Property Details & Submit
            </Text>
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' },
            ]}
          />
        </View>
        {renderStep()}
        <View style={styles.buttonContainer}>
          {step > 1 && (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          )}
          {step < 3 && (
            <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
              <Text style={styles.buttonText}>Update And Next</Text>
            </TouchableOpacity>
          )}
          {step === 3 && (
            <TouchableOpacity
              onPress={handleSubmit}
              style={[styles.submitButton, isLoading && styles.disabledButton]}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Submit Property</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 16,
  },
  messageContainer: {
    backgroundColor: '#d4edda',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  messageText: {
    color: '#155724',
    fontSize: 14,
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  modalButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
  },
  progressIcon: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressIconActive: {
    backgroundColor: '#007bff',
  },
  progressIconText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
  },
  progressTextActive: {
    color: '#007bff',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#eaea',
    borderRadius: 4,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#dc3545',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  inputWithUnit: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRightWidth: 0,
    flex: 1,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 150 : 50,
    width: '100%',
  },
  unitPickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderLeftWidth: 0,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: '#f7f7f7',
    overflow: 'hidden',
    flex: 0.4,
  },
  unitPicker: {
    height: Platform.OS === 'ios' ? 150 : 50,
    width: '100%',
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#333',
    marginRight: 8,
  },
  radioSelected: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  radioText: {
    fontSize: 14,
    color: '#333',
  },
  checkboxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    marginRight: 8,
  },
  checkboxSelected: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  checkboxText: {
    fontSize: 14,
    color: '#333',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    width: '48%',
    padding: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  selectedActionButton: {
    backgroundColor: '#ccc',
    borderColor: '#000',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
  },
  selectedActionButtonText: {
    color: '#fff',
  },
  propertyButton: {
    width: '48%',
    padding: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  selectedPropertyButton: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  propertyButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedPropertyButtonText: {
    color: '#fff',
  },
  fieldGrid: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: '#6b7280',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginRight: 8,
  },
  nextButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#60a5fa',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 8,
  },
  fileButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#e6fffa',
    alignItems: 'center',
  },
  fileButtonText: {
    color: '#15803d',
    fontSize: 14,
    fontWeight: '600',
  },
  previewContainer: {
    marginTop: 16,
  },
  previewText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  previewItem: {
    width: '23%',
    marginBottom: 8,
    alignItems: 'center',
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  mainImageLabel: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#3b82f6',
    color: '#fff',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  previewFileName: {
    fontSize: 10,
    color: '#333',
    marginTop: 4,
    textAlign: 'center',
  },
  selectedFilesContainer: {
    marginTop: 8,
  },
  selectedFilesText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  selectedFileText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 8,
  },
});

export default SellProperty;