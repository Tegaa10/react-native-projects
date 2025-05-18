/*
"StAuth10244: I Tega Onororemu, 000795872 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else."
*/

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, FlatList, ImageBackground } from 'react-native';

export default function App() {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const apiKey = 'e8bc5789abcc839857f78c65679481c5';

    const fetchWeather = async () => {
        setErrorMessage(null);
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
            const data = await response.json();
            if (data.cod === 200) {
                setWeatherData(data);
                fetchForecast(data.coord.lat, data.coord.lon);
            } else {
                setErrorMessage("City not found. Please try again.");
            }
        } catch (error) {
            setErrorMessage("Error fetching weather data. Please check your connection.");
        }
    };

    const fetchForecast = async (lat, lon) => {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`);
            const data = await response.json();
            if (data.cod === "200") {
                const hourlyForecast = data.list.slice(0, 12); // Next 12 hours as sample
                setForecastData(hourlyForecast);
            }
        } catch (error) {
            setErrorMessage("Error fetching forecast data.");
        }
    };

    const clearData = () => {
        setCity('');
        setWeatherData(null);
        setForecastData([]);
        setErrorMessage(null);
    };

    return (
        <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=800&q=80' }}
            style={styles.backgroundImage}
        >
            <View style={styles.overlay}>
                <Text style={styles.title}>Weather Report</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter city name"
                    value={city}
                    onChangeText={setCity}
                    placeholderTextColor="#ccc"
                />
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={fetchWeather}>
                        <Text style={styles.buttonText}>Get Weather</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.clearButton} onPress={clearData}>
                        <Text style={styles.buttonText}>Clear</Text>
                    </TouchableOpacity>
                </View>

                {errorMessage && (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                )}

                {weatherData && (
                    <View style={styles.currentWeatherContainer}>
                        <Text style={styles.cityText}>{weatherData.name}</Text>
                        <Text style={styles.tempText}>{(weatherData.main.temp - 273.15).toFixed(1)}°C</Text>
                        <Text style={styles.weatherDescription}>{weatherData.weather[0].description}</Text>
                        <Text style={styles.feelsLikeText}>
                            Feels {Math.round(weatherData.main.feels_like - 273.15)}° • H: {Math.round(weatherData.main.temp_max - 273.15)}° L: {Math.round(weatherData.main.temp_min - 273.15)}°
                        </Text>
                        <Image
                            source={{ uri: `https://openweathermap.org/img/wn/${weatherData.weather[0]?.icon || '01d'}@2x.png` }}
                            style={styles.icon}
                        />
                    </View>
                )}

                {forecastData.length > 0 && (
                    <View style={styles.forecastContainer}>
                        <Text style={styles.forecastTitle}>Hourly Forecast</Text>
                        <FlatList
                            data={forecastData}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal
                            contentContainerStyle={styles.hourlyList}
                            renderItem={({ item }) => (
                                <View style={styles.hourlyItem}>
                                    <Text style={styles.hourlyText}>{new Date(item.dt_txt).getHours() % 12 || 12}{new Date(item.dt_txt).getHours() < 12 ? 'am' : 'pm'}</Text>
                                    <Image
                                        source={{ uri: `https://openweathermap.org/img/wn/${item.weather[0]?.icon || '01d'}@2x.png` }}
                                        style={styles.hourlyIcon}
                                    />
                                    <Text style={styles.hourlyTemp}>{Math.round(item.main.temp - 273.15)}°</Text>
                                    <Text style={styles.hourlyFeels}>Feels {Math.round(item.main.feels_like - 273.15)}°</Text>
                                    <Text style={styles.hourlyPrecip}>{item.pop * 100}%</Text>
                                </View>
                            )}
                        />
                    </View>
                )}
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#fff',
        padding: 10,
        marginBottom: 20,
        borderRadius: 8,
        backgroundColor: '#333',
        fontSize: 16,
        color: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#FFD700',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        width: '48%',
    },
    clearButton: {
        backgroundColor: '#666',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        width: '48%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    currentWeatherContainer: {
        marginTop: 20,
        alignItems: 'center',
        backgroundColor: '#333',
        padding: 20,
        borderRadius: 10,
        width: '100%',
    },
    cityText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    tempText: {
        fontSize: 50,
        color: '#FFD700',
        fontWeight: 'bold',
    },
    weatherDescription: {
        fontSize: 18,
        color: '#ccc',
        textTransform: 'capitalize',
        marginBottom: 5,
    },
    feelsLikeText: {
        fontSize: 16,
        color: '#aaa',
    },
    icon: {
        width: 80,
        height: 80,
        marginTop: 10,
    },
    forecastContainer: {
        marginTop: 20,
        width: '100%',
    },
    forecastTitle: {
        color: '#FFD700',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        alignSelf: 'center',
    },
    hourlyList: {
        paddingHorizontal: 10,
    },
    hourlyItem: {
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 10,
        width: 80,
    },
    hourlyText: {
        color: '#FFD700',
        fontWeight: 'bold',
        fontSize: 14,
    },
    hourlyIcon: {
        width: 40,
        height: 40,
    },
    hourlyTemp: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    hourlyFeels: {
        color: '#aaa',
        fontSize: 12,
    },
    hourlyPrecip: {
        color: '#aaa',
        fontSize: 12,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginTop: 10,
    },
});
