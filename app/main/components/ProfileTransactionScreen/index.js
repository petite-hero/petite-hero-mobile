import React, { useContext, useEffect, useState } from 'react';
import { AsyncStorage, FlatList, Text, View } from 'react-native';
import styles from './styles/index.css';
import Header from "../../../base/components/Header";
import { Loader } from '../../../utils/loader';
import { handleError } from '../../../utils/handleError';
import { fetchWithTimeout } from '../../../utils/fetch';
import { COLORS, PORT } from '../../../const/const';
import TransactionItem from './TransactionItem';

const ProfileTransactionScreen = (props) => {
  const { t, locale } = useContext(props.route.params.localizationContext);
  const [transactions, setTransactions] = useState("");
  const [loading, setLoading] = useState(true);

  const getTransactions = async() => {
    try {
      const ip = await AsyncStorage.getItem("IP");
      const id = await AsyncStorage.getItem("user_id");
      const response = await fetchWithTimeout("http://" + ip + PORT + "/parent/" + id + "/payment/list");
      const result = await response.json();
      if (result.code === 200) {
        setTransactions(result.data);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getTransactions();
  }, [])

  return (
    loading ? <Loader loading={loading}/>
    :
    <View style={styles.container}>
      <Header navigation={props.navigation} title={t("profile-subscription-history")}/>
      {transactions.length > 0 ?
      <FlatList
        data={transactions}
        keyExtractor={item => item.transactionId + ""}
        renderItem={({item, index}) => <TransactionItem date={item.date} index={index} title={item.content} amount={item.amount} locale={locale}/>}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center"
        }}
      />
      :
      <View style={{
        width: "100%",
        height: "70%",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <Text style={{
          fontFamily: "AcuminBold",
          fontSize: 18,
          color: COLORS.MEDIUM_CYAN
        }}>
          {t("profile-subscription-none")}
        </Text>
      </View>
      }
    </View>
  )
}

export default ProfileTransactionScreen;