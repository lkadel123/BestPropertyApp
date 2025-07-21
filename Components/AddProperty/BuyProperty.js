import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import propertyConfigData from '../../assets/Data/BuyPropertyConfig.json';

const { residential, commercial, step3Fields } = propertyConfigData;

const BuyProperty = () => {
  const { user, userToken } = useContext(AuthContext);
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState('residential');
  const [activeButton, setActiveButton] = useState('');
  const [activeCommercial, setActiveCommercial] = useState('');
  const [currentCategory, setCurrentCategory] = useState('');
  const [message, setMessage] = useState('');
  const [errorModal, setErrorModal] = useState({ isOpen: false, messages: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [storedata, setStoreData] = useState({
    userMobile: '',
    person: '',
  });

  const [propertyDetails, setPropertyDetails] = useState({
    bhk: '',
    kothi_story_type: '',
    floor_no: '',
    total_floors: '',
    land: '',
    land_unit: '',
    built: '',
    built_unit: '',
    additional: '',
    additional_unit: '',
    furnishing_status: '',
    carpet: '',
    carpet_unit: '',
    property_type: '',
    sqft: '',
    sqft_unit: '',
    width_length: '',
    road_width: '',
    road_width_unit: '',
    address: '',
    requirement: '',
    timeline: '',
  });

  const isLoggedIn = () => {
    return !!userToken && !!user;
  };

  const handleOptionChange = (value) => {
    setSelectedOption(value);
    setCurrentCategory(value);
    setPropertyDetails((prev) => ({
      ...prev,
      property_type: value,
    }));
    setActiveButton('');
    setActiveCommercial('');
    setShowBackButton(false);
  };

  const handlePropertyDetailsChange = (name, value) => {
    setPropertyDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResidentialProperty = (type) => {
    setActiveButton(type);
    setActiveCommercial('');
    setCurrentCategory('residential');
    setSelectedOption('residential');
    setPropertyDetails((prev) => ({
      ...prev,
      property_type: 'residential',
      property_type_sub: type,
    }));
    setShowBackButton(true);
  };

  const handleCommercialProperty = (type) => {
    setActiveCommercial(type);
    setActiveButton('');
    setCurrentCategory('commercial');
    setSelectedOption('commercial');
    setPropertyDetails((prev) => ({
      ...prev,
      property_type: 'commercial',
      property_type_sub: type,
    }));
    setShowBackButton(true);
  };

  const handlePropertyBack = () => {
    setActiveButton('');
    setActiveCommercial('');
    setShowBackButton(false);
    setPropertyDetails((prev) => ({
      ...prev,
      property_type_sub: '',
    }));
  };

  const handleNewData = (name, value) => {
    setStoreData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep = () => {
    const errors = [];
    if (!selectedOption) {
      errors.push('Please select a property category (Residential or Commercial).');
    }
    if (selectedOption && !propertyDetails.property_type_sub) {
      errors.push(`Please select a ${selectedOption} property type.`);
    }
    if (!isLoggedIn()) {
      if (!storedata.userMobile || !/^\d{10}$/.test(storedata.userMobile)) {
        errors.push('Please enter a valid 10-digit mobile number.');
      }
      if (!storedata.person) {
        errors.push('Please enter your name.');
      }
    }
    if (step === 3) {
      if (!propertyDetails.timeline) {
        errors.push('Please select a timeline.');
      }
    }
    if (errors.length > 0) {
      setErrorModal({ isOpen: true, messages: errors });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setErrorModal({ isOpen: false, messages: [] });
      setStep(3);
    }
  };

  const handleBack = () => {
    setErrorModal({ isOpen: false, messages: [] });
    if (step === 3) {
      setStep(1);
      setShowBackButton(true);
    } else if (step === 1) {
      navigation.navigate('Budget');
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setMessage('');
    setErrorModal({ isOpen: false, messages: [] });

    const finalMobile = isLoggedIn() ? user?.phone || '' : storedata.userMobile;
    const finalPerson = isLoggedIn() ? user?.name || '' : storedata.person;

    const errors = [];
    if (!finalMobile || !/^\d{10}$/.test(finalMobile)) {
      errors.push('Please provide a valid 10-digit mobile number.');
    }
    if (!finalPerson) {
      errors.push('Please provide your name.');
    }
    if (!propertyDetails.timeline) {
      errors.push('Please select a timeline.');
    }
    if (errors.length > 0) {
      setErrorModal({ isOpen: true, messages: errors });
      setIsLoading(false);
      return;
    }

    const property_type_sub = currentCategory === 'residential' ? activeButton : activeCommercial;
    const category = currentCategory;
    const property_for = 'Buy';

    const payload = {
      infotype: 'requirement',
      property_for,
      property_type: category,
      property_type_sub,
      uName: finalPerson,
      mobile: finalMobile,
      address: propertyDetails.address,
      requirement: propertyDetails.requirement,
      status: 'Pending',
      leads_type: 'buyer',
      rDate: new Date().toISOString(),
      userid: await AsyncStorage.getItem('userid') || 0,
      timeline: propertyDetails.timeline,
      bhk: propertyDetails.bhk,
      carpet: propertyDetails.carpet ? `${propertyDetails.carpet} ${propertyDetails.carpet_unit || 'sq.ft'}` : '',
      built: propertyDetails.built ? `${propertyDetails.built} ${propertyDetails.built_unit || 'sq.ft'}` : '',
      land: propertyDetails.land ? `${propertyDetails.land} ${propertyDetails.land_unit || 'sq.ft'}` : '',
      additional: propertyDetails.additional ? `${propertyDetails.additional} ${propertyDetails.additional_unit || 'acres'}` : '',
      floor_no: propertyDetails.floor_no,
      total_floors: parseInt(propertyDetails.total_floors) || null,
      kothi_story_type: propertyDetails.kothi_story_type,
      furnishing_status: propertyDetails.furnishing_status,
      width_length: propertyDetails.width_length,
      road_width: propertyDetails.road_width ? `${propertyDetails.road_width} ${propertyDetails.road_width_unit || 'ft'}` : '',
      sqft: propertyDetails.sqft ? `${propertyDetails.sqft} ${propertyDetails.sqft_unit || 'sq.ft'}` : '',
    };

    try {
      if (!userToken) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await fetch('https://api.example.com/api/Buyer/addBuyer', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
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
    const { name, label, type, placeholder, options, option, maxLength } = field;

    if (type === 'select' && selectedOption && step === 1) {
      return (
        <View key={name} style={styles.fieldContainer}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.buttonGrid}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => handlePropertyDetailsChange(name, option)}
                style={[
                  styles.optionButton,
                  propertyDetails[name] === option && styles.selectedOptionButton,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    propertyDetails[name] === option && styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    } else if (type === 'select') {
      return (
        <View key={name} style={styles.fieldContainer}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={propertyDetails[name] || ''}
              onValueChange={(value) => handlePropertyDetailsChange(name, value)}
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
    } else if (type === 'selectOrText') {
      return (
        <View key={name} style={styles.fieldContainer}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, option && styles.inputWithUnit]}
              value={propertyDetails[name] || ''}
              onChangeText={(value) => handlePropertyDetailsChange(name, value)}
              placeholder={placeholder}
              maxLength={maxLength}
              keyboardType="numeric"
            />
            {option && (
              <View style={styles.unitPickerContainer}>
                <Picker
                  selectedValue={propertyDetails[`${name}_unit`] || option[0]}
                  onValueChange={(value) => handlePropertyDetailsChange(`${name}_unit`, value)}
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
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={propertyDetails[name] || ''}
            onChangeText={(value) => handlePropertyDetailsChange(name, value)}
            placeholder={placeholder}
            maxLength={maxLength}
            multiline
            numberOfLines={4}
          />
        </View>
      );
    } else {
      return (
        <View key={name} style={styles.fieldContainer}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={styles.input}
            value={propertyDetails[name] || ''}
            onChangeText={(value) => handlePropertyDetailsChange(name, value)}
            placeholder={placeholder}
            maxLength={maxLength}
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
                    Mobile Number <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={storedata.userMobile}
                    onChangeText={(value) => handleNewData('userMobile', value)}
                    placeholder="Enter 10-digit mobile number"
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
                      onPress={() => handleResidentialProperty(type)}
                      style={[
                        styles.propertyButton,
                        activeButton === type && styles.selectedPropertyButton,
                        activeButton && activeButton !== type && styles.hidden,
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
                      onPress={() => handleCommercialProperty(type)}
                      style={[
                        styles.propertyButton,
                        activeCommercial === type && styles.selectedPropertyButton,
                        activeCommercial && activeCommercial !== type && styles.hidden,
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
                {activeCommercial && commercial[activeCommercial]?.step1 && (
                  <View style={styles.fieldGrid}>
                    {commercial[activeCommercial].step1.map(renderField)}
                  </View>
                )}
              </>
            )}
          </View>
        );
      case 3:
        return <View style={styles.fieldGrid}>{step3Fields.map(renderField)}</View>;
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {message && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}
      <Modal isVisible={errorModal.isOpen} onBackdropPress={closeModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Error</Text>
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
      <View style={styles.progressBarContainer}>
        <View
          style={[styles.progressBar, { width: step === 1 ? '50%' : '100%' }]}
        />
      </View>
      {renderStep()}
      <View style={styles.buttonContainer}>
        {(step > 1 || showBackButton) && (
          <TouchableOpacity
            onPress={step === 1 ? handlePropertyBack : handleBack}
            style={styles.backButton}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        )}
        {step < 3 && (
          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Text style={styles.buttonText}>Next</Text>
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
              <Text style={styles.buttonText}>Submit Details</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
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
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginVertical: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 4,
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
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  hidden: {
    display: 'none',
  },
  fieldGrid: {
    marginBottom: 16,
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
  optionButton: {
    width: '48%',
    padding: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  selectedOptionButton: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#fff',
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
});

export default BuyProperty;