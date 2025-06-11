import {
  StyleSheet,
  TextInput,
  View,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import React, { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/authContext";
import { moderateScale, verticalScale } from "react-native-size-matters";
import Icon from "react-native-vector-icons/Ionicons";

const Search = ({ navigation }) => {
  const [state] = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchInputRef = useRef(null);

  const popularSearches = [
    "UpdateProfile",
    "History",
    "About",
    "Account",
    "UserInfo",
    "TermOfUse",
    "PrivacyPolicy",
    "ContactUs",
    "Chat",
    "Recording",
  ];

  useEffect(() => {
    // Focus the search input when the component mounts
    searchInputRef.current.focus();
  }, []);

  const handleSearch = (screen) => {
    navigation.navigate(screen);
    setSearchQuery("");
    setSuggestions([]);

    // Update recent searches
    setRecentSearches((prevSearches) => {
      const filteredSearches = prevSearches.filter((item) => item !== screen);
      const newSearches = [screen, ...filteredSearches].slice(0, 5);
      return newSearches;
    });
  };

  const handleChange = (query) => {
    setSearchQuery(query);
    const filteredSuggestions = popularSearches.filter((screen) =>
      screen.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  const renderSearchItem = (item) => (
    <TouchableOpacity onPress={() => handleSearch(item)}>
      <Text style={styles.suggestion}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <TextInput
          ref={searchInputRef} // Assign the ref to the TextInput
          style={styles.searchBar}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={handleChange}
          onSubmitEditing={() => {
            const targetScreen =
              searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1);
            if (popularSearches.includes(targetScreen)) {
              handleSearch(targetScreen);
            } else {
              alert("No matching screen found.");
            }
          }}
        />
      </View>

      {/* Suggestions List */}
      {searchQuery && suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => renderSearchItem(item)}
          style={styles.suggestionList}
        />
      )}

      {/* Recent Searches */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Recent Searches</Text>
        {recentSearches.length > 0 ? (
          <FlatList
            data={recentSearches}
            keyExtractor={(item) => item}
            renderItem={({ item }) => renderSearchItem(item)}
            style={styles.suggestionList}
          />
        ) : (
          <Text style={styles.noSearches}>No recent searches</Text>
        )}
      </View>

      {/* Popular Searches */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Popular Searches</Text>
        <FlatList
          data={popularSearches}
          keyExtractor={(item) => item}
          renderItem={({ item }) => renderSearchItem(item)}
          style={styles.suggestionList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(35),
    margin: moderateScale(10),
    borderRadius: moderateScale(25),
    backgroundColor: "#fff",
    paddingHorizontal: moderateScale(10),
  },
  backButton: {
    paddingRight: moderateScale(10),
  },
  searchBar: {
    flex: 1,
    height: moderateScale(38),
    borderRadius: moderateScale(25),
    paddingHorizontal: moderateScale(12),
  },
  suggestionList: {
    maxHeight: verticalScale(200),
    marginTop: verticalScale(10),
  },
  suggestion: {
    padding: moderateScale(10),
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  sectionContainer: {
    marginVertical: verticalScale(10),
    marginHorizontal: moderateScale(10),
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: moderateScale(16),
    marginBottom: verticalScale(5),
  },
  noSearches: {
    color: "#888",
  },
});

export default Search;
