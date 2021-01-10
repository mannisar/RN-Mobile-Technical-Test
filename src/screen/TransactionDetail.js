import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ToastAndroid } from "react-native";
import { currencyFormatter, dateFormatter } from "../utils/Formatter";
import AppTheme from "../styles"
import Clipboard from "@react-native-community/clipboard";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const TransactionDetail = ({ route, navigation }) => {
    const [isDetail, setIsDetail] = useState(false);
    const item = route.params.propsData;

    // @NOTE: SET BOOLEAN UTK LIHAT/TUTUP DETIAL TRANSAKSI
    const onPressShowButton = () => {
        setIsDetail(!isDetail);
    }

    // @NOTE: PERPINDAHAN SCREEN KE TRANSAKSI
    const onPressNavigate = () => {
        navigation.navigate('Transaction');
    }

    // @NOTE: COPY ID TRANSAKSI
    const onPressClipboard = (item) => {
        const message = "id transaksi disalin";
        const duration = 5;

        Clipboard.setString(item.id);
        ToastAndroid.show(message, duration);
    }

    return (
        <>
            {/** CONTAINER */}
            <SafeAreaView style={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={onPressNavigate}>
                    <FontAwesome name="arrow-left" size={20} color={AppTheme.colors.white} />
                </TouchableOpacity>
                {/** MAIN WRAPPER */}
                <View style={styles.mainWrapper}>
                    {/** COLUMN 1 */}
                    <View style={styles.sectionOne}>
                        <Text style={styles.sectionOneText}>{`ID TRANSAKSI: #${item.id}`}</Text>
                        <TouchableOpacity onPress={() => onPressClipboard(item)}>
                            <MaterialCommunityIcons name="content-copy" color={AppTheme.colors.orange} size={15} />
                        </TouchableOpacity>
                    </View>
                    {/** COLUMN 2 */}
                    <View style={styles.sectionTwo}>
                        <Text style={styles.fontBolder}>DETAIL TRANSAKSI</Text>
                        <TouchableOpacity onPress={onPressShowButton}>
                            <Text style={styles.sectionTwoText}>{isDetail ? "Tutup" : "Lihat"}</Text>
                        </TouchableOpacity>
                    </View>
                    {/** COLUN 3 */}
                    <View style={styles.sectionThree}>
                        {isDetail ? (
                            <>
                                <View style={styles.sectionThreeContentOne}>
                                    <Text style={styles.fontBolder}>{item.sender_bank.toUpperCase()} {<FontAwesome name="long-arrow-right" size={15} colors={AppTheme.colors.black} />} {item.beneficiary_bank.toUpperCase()}</Text>
                                </View>
                                <View style={styles.sectionThreeContentTwoThree}>
                                    <View style={{ width: AppTheme.metrics.dimensions.fullWidth / 2 }}>
                                        <Text style={styles.sectionThreeContentText}>{item.beneficiary_name.toUpperCase()}</Text>
                                        <Text>{item.account_number}</Text>
                                    </View>
                                    <View style={{ width: AppTheme.metrics.dimensions.fullWidth / 2 }}>
                                        <Text style={styles.sectionThreeContentText}>NOMINAL</Text>
                                        <Text>{currencyFormatter(item.amount)}</Text>
                                    </View>
                                </View>
                                <View style={styles.sectionThreeContentTwoThree}>
                                    <View style={{ width: AppTheme.metrics.dimensions.fullWidth / 2 }}>
                                        <Text style={styles.sectionThreeContentText}>BERITA TRANSFER</Text>
                                        <Text>{item.remark}</Text>
                                    </View>
                                    <View style={{ width: AppTheme.metrics.dimensions.fullWidth / 2 }}>
                                        <Text style={styles.sectionThreeContentText}>KODE UNIK</Text>
                                        <Text>{item.unique_code}</Text>
                                    </View>
                                </View>
                                <View style={styles.sectionThreeContentFour}>
                                    <Text style={styles.sectionThreeContentText}>WAKTU DI BUAT</Text>
                                    <Text>{dateFormatter(item.status === "PENDING" ? item.created_at : item.completed_at)}</Text>
                                </View>
                            </>
                        ) : null}
                    </View>
                </View>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppTheme.colors.white
    },
    backButton: {
        justifyContent: "center",
        padding: AppTheme.metrics.padding.md,
        margin: AppTheme.metrics.margin.md,
        position: 'absolute',
        bottom: 0,
        backgroundColor: AppTheme.colors.orange,
        borderRadius: 50
    },
    mainWrapper: {
        height: AppTheme.metrics.dimensions.fullHeight / 2 * 0.80,
        padding: AppTheme.metrics.padding.lg
    },
    fontBolder: {
        fontWeight: 'bold'
    },
    sectionOne: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: AppTheme.colors.customGrey,
        borderBottomWidth: 0.20
    },
    sectionOneText: {
        fontWeight: 'bold',
        paddingRight: AppTheme.metrics.padding.sm
    },
    sectionTwo: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: AppTheme.colors.customGrey,
        borderBottomWidth: 1.5
    },
    sectionTwoText: {
        fontWeight: '700',
        color: AppTheme.colors.orange
    },
    sectionThree: {
        flex: 8,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    sectionThreeContentOne: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    sectionThreeContentTwoThree: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    sectionThreeContentFour: {
        flex: 1,
        flexDirection: 'column'
    },
    sectionThreeContentText: {
        fontWeight: '700',
        color: AppTheme.colors.black
    }

})

export default TransactionDetail;