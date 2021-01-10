import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, Text, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback, RefreshControl, FlatList, TextInput } from "react-native";
import { currencyFormatter, dateFormatter } from "../utils/Formatter";
import AppTheme from "../styles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const Transaction = ({ navigation }) => {
    const [listData, setListData] = useState([]);
    const [listSearch, setListSearch] = useState([]);
    const [valueSearch, setValueSearch] = useState("");
    const [isRefresh, setIsRefresh] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [isOverlay, setIsOverlay] = useState(false);
    const [sortIndex, setSortIndex] = useState(0);
    const sortRef = [
        {
            name: "URUTKAN",
            flag: "default"
        },
        {
            name: "Nama A-Z",
            flag: "N"
        },
        {
            name: "Nama Z-A",
            flag: "N-Reverse"
        },
        {
            name: "Tanggal Terbaru",
            flag: "T"
        },
        {
            name: "Tanggal Terlama",
            flag: "T-Reverse"
        }
    ];

    // @NOTE: MENJALANKAN FUNGSI FETCH DATA KETIKA APLIKASI PERTAMA KALI DI BUKA
    useEffect(() => fetchData(), []);

    // @NOTE: UNTUK MENDAPATKAN DATA DARI SERVER
    function fetchData() {
        fetch('https://nextar.flip.id/frontend-test', {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((data) => {
                if (data) {
                    const dataObj = data;
                    const dataKey = Object.keys(data);
                    const dataLeng = dataKey.length;
                    const dataArray = [];

                    for (let i = 0; i < dataLeng; i++) {
                        dataArray.push(dataObj[dataKey[i]]);
                    }

                    setListData(dataArray);
                    setIsRefresh(false);
                }
            })
            .catch((error) => console.log(error))
    }

    // @NOTE: FUNCTION MEMUNCULKAN MODAL
    const onPressModal = () => {
        setIsOverlay(true);
    }

    // @NOTE: FUNCTION KLIK BUTTON MODAL
    const onPressSort = (element, index) => {
        setSortIndex(index);
        setIsOverlay(false);
        if (element.flag === "default") {
            // setListData(listAwal);
        } else if (element.flag === "N") {
            const newArray = listData.sort((a, b) => { return a.beneficiary_name.localeCompare(b.beneficiary_name) });
            setListData(newArray);
        } else if (element.flag === "N-Reverse") {
            const newArray = listData.sort((a, b) => { return b.beneficiary_name.localeCompare(a.beneficiary_name) });
            setListData(newArray);
        } else if (element.flag === "T") {
            const dateArray = listData.map((element) => {
                element.compare_date = element.status === "PENDING" ? element.created_at : element.completed_at
                return element;
            })

            const newArray = dateArray.sort((a, b) => { return b.compare_date.localeCompare(a.compare_date) });
            setListData(newArray);
        } else if (element.flag === "T-Reverse") {
            const dateArray = listData.map((element) => {
                element.compare_date = element.status === "PENDING" ? element.created_at : element.completed_at
                return element;
            })

            const newArray = dateArray.sort((a, b) => { return a.compare_date.localeCompare(b.compare_date) });
            setListData(newArray);
        }
    }

    // @NOTE: FUNCTION REALTIME SEARCH.
    const onChangeSearch = (value) => {
        if (value.length === 0) {
            setValueSearch("");
            setListSearch([]);
            return setIsSearch(false);
        }

        const newArray = listData.filter((item) => {
            return item.amount.toString().includes(value.toString()) ||
                item.beneficiary_name.toUpperCase().includes(value.toUpperCase()) ||
                item.sender_bank.toUpperCase().includes(value.toUpperCase()) ||
                item.beneficiary_bank.toUpperCase().includes(value.toUpperCase())
        });
        setValueSearch(value);
        setListSearch(newArray);
        setIsSearch(true);
    }

    // @NOTE: REFRESH HALAMAN UNTUK MENDAPATKAN DATA TERBARU
    const onRefresh = () => {
        setIsRefresh(true);
        setTimeout(() => {
            fetchData();
            setIsRefresh(false);
            setSortIndex(0);
        }, 300);
    }

    // @NOTE: UNTUK MERUBAH STATUS
    const statusFormatter = (item) => {
        if (item === "SUCCESS") {
            return "BERHASIL";
        } else if (item === "PENDING") {
            return "PENGECEKAN";
        }
    }

    // @NOTE: PERPINDAHAN SCREEN KE TRANSAKSI DETAIL
    const onPressNavigate = (item) => navigation.navigate('Transaction Detail', { propsData: item });


    // @NOTE UNTUK MAPPING LIST TRANSAKSI
    const renderItem = ({ item }) => {
        return (
            <>
                <TouchableNativeFeedback onPress={() => onPressNavigate(item)}>
                    <View style={[styles.listWrapper, {
                        borderLeftColor: item.status === "PENDING" ? AppTheme.colors.orange : AppTheme.colors.green
                    }]}>
                        <View style={styles.listSectionInformation}>
                            <Text>{item.sender_bank.toUpperCase()} {<FontAwesome name="long-arrow-right" size={15} colors={AppTheme.colors.black} />} {item.beneficiary_bank.toUpperCase()}</Text>
                            <Text>{item.beneficiary_name.toUpperCase()}</Text>
                            <Text>{currencyFormatter(item.amount)} - {dateFormatter(item.status === "PENDING" ? item.created_at : item.completed_at)}</Text>
                        </View>
                        <View style={[styles.listSectionStatus, {
                            backgroundColor: item.status === "PENDING" ? AppTheme.colors.orange : AppTheme.colors.green,
                            borderColor: item.status === "PENDING" ? AppTheme.colors.orange : AppTheme.colors.green
                        }]}>
                            <Text style={styles.listSectionStatusText}>
                                {statusFormatter(item.status)}
                            </Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>
            </>
        )
    }

    return (
        <>
            {/** CONTAINER */}
            <SafeAreaView style={styles.container}>
                {/** HEADER WRAPPER */}
                <View style={styles.headerWrapper}>
                    <View style={styles.headerContent}>
                        {/*** SEARCH */}
                        <View style={styles.searchBar}>
                            <View>
                                <EvilIcons name="search" color={AppTheme.colors.grey} size={30} />
                            </View>
                            <View>
                                <TextInput
                                    placeholder="Cari nama, bank, atau nominal"
                                    onChangeText={(value) => onChangeSearch(value)}
                                    value={valueSearch}
                                    style={styles.fontPlaceholder}
                                />
                            </View>
                        </View>
                        {/*** SORT */}
                        <View style={styles.sortIcon}>
                            <TouchableOpacity onPress={onPressModal}>
                                <MaterialCommunityIcons size={25} color={AppTheme.colors.orange} name="filter-plus" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {/** MAIN WRAPPER */}
                <View style={styles.mainWrapper}>
                    {/** LIST TRANSAKSI */}
                    <FlatList
                        data={!isSearch ? listData : listSearch}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ padding: 8 }}
                        refreshControl={<RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />}
                    />
                </View>
            </SafeAreaView>
            {/** OVERLAY / MODAL */}
            {
                isOverlay ? (
                    <TouchableWithoutFeedback onPressOut={() => setIsOverlay(false)}>
                        <View style={styles.overlayWrapper}>
                            <View style={styles.overlayContent}>
                                {sortRef.map((element, index) => (
                                    <TouchableOpacity key={index} onPress={() => onPressSort(element, index)}>
                                        <View style={styles.overlayRow}>
                                            <View style={styles.overlayDots}>
                                                {index === sortIndex ? (
                                                    <FontAwesome name="dot-circle-o" color={AppTheme.colors.orange} size={20} />
                                                ) : (
                                                        <Entypo name="circle" color={AppTheme.colors.orange} size={20} />
                                                    )}
                                            </View>
                                            <View>
                                                <Text style={styles.overlayText}>{element.name}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                ) : null
            }
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppTheme.colors.white
    },
    headerWrapper: {
        height: AppTheme.metrics.dimensions.fullHeight / 2 * 0.20,
        padding: AppTheme.metrics.padding.sm
    },
    headerContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        elevation: 3,
        borderRadius: 8,
        paddingHorizontal: AppTheme.metrics.padding.sm,
        backgroundColor: AppTheme.colors.white
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    sortIcon: {
        justifyContent: 'center',
        paddingRight: AppTheme.metrics.padding.sm
    },
    mainWrapper: {
        flex: 1
    },
    listWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 3,
        borderRadius: 8,
        borderLeftWidth: 10,
        paddingVertical: AppTheme.metrics.padding.sm + 2,
        paddingHorizontal: AppTheme.metrics.padding.md + 2,
        marginBottom: AppTheme.metrics.margin.sm,
        backgroundColor: AppTheme.colors.white
    },
    listSectionInformation: {
        flexDirection: 'column'
    },
    listSectionStatus: {
        borderWidth: 1,
        borderRadius: 5,
        padding: AppTheme.metrics.padding.sm
    },
    listSectionStatusText: {
        color: AppTheme.colors.white,
        fontWeight: 'bold'
    },
    overlayWrapper: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        justifyContent: "center",
        alignItems: "center",
        opacity: 0.9,
        backgroundColor: AppTheme.colors.black
    },
    overlayContent: {
        width: AppTheme.metrics.dimensions.fullWidth / 2 * 1.50,
        borderRadius: 8,
        backgroundColor: AppTheme.colors.white
    },
    overlayRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: AppTheme.metrics.padding.lg,
        paddingHorizontal: AppTheme.metrics.padding.md
    },
    overlayDots: {
        paddingHorizontal: AppTheme.metrics.padding.md
    },
    overlayText: {
        fontSize: AppTheme.metrics.fonts.md + 2
    },
    overlayCloseIcon: {
        position: 'absolute',
        right: 0,
        paddingRight: AppTheme.metrics.padding.sm,
        paddingTop: AppTheme.metrics.padding.sm
    },
    fontPlaceholder: {
        fontSize: AppTheme.metrics.fonts.md
    }
})

export default Transaction;