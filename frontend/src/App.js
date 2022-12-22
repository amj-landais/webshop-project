import logoImg from './media/logo.png';
import './App.css';
import ItemsContainer from './components/ItemsContainer';
import {useCallback, useEffect, useState} from 'react';
import Item from './components/Item';
import Basket from './components/Basket';
import InputFormLogIn from './components/InputFormLogin';
import InputFormRegister from './components/InputFormRegister';
import {BrowserRouter, Routes, Route, NavLink} from 'react-router-dom';
import MyItems from "./components/MyItems";
import Account from "./components/Account";

function App() {

    const apiUriBase = 'http://127.0.0.1:8000/api/';
    const apiUri = apiUriBase + 'v1/items';

    const [availableItems, setAvailableItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    let availableItemsList = [];
    const [basketList, setBasketList] = useState(() => {
        if (sessionStorage.basketList) return JSON.parse(sessionStorage.getItem("basketList"));
        else return [];
    });
    const [logged, setLogged] = useState(false);
    const [username, setUsername] = useState(() => {
        if (sessionStorage.username) {
            return sessionStorage.getItem("username");
        } else return ''
    });
    const [searchText, setSearchText] = useState('');

    /** add item to basketList */
    const addItemClick = (item) => {
        setBasketList((prevState) => [...prevState, item]);
    }

    availableItemsList = availableItems.map((item) => {
            let clickable = true;
            if (basketList.find((i) => i.pk === item.pk)) {
                clickable = false;
            }

            return <Item item={item} addHandler={addItemClick} clickable={clickable} loggedIn={logged}
                         addBasketPossible={true}/>
        }
    )



    /** remove all items from the basketList */
    const removeAllClick = () => {
        setBasketList([]);
    }


    /** remove item from basketList */
    const removeItemClick = (itemId) => {
        setBasketList((prevState) => {
            return prevState.filter((id, idx) => idx !== itemId)
        })
    }

    //using local storage to store the basket whenever it changes.
    useEffect(() => {
        sessionStorage.setItem("basketList", JSON.stringify(basketList))
    }, [basketList])

    useEffect(() => {
        sessionStorage.setItem("username", username)
    }, [username])


    useEffect(() => {
        document.title = 'Webshop';
    }, [])


    //--------------------- LOGGING IN --------------------------

    const [loginFailed, setLoginFailed] = useState(false);

    const [token, setToken] = useState(() => {
        // this function is needed if we want to use local storage
        if (sessionStorage.token) {
            if (sessionStorage.getItem("token") !== "\"\"") {
                setLogged(true);
            }
            return sessionStorage.getItem("token");
        } else return '';
    });

    //using local storage to store the token whenever it changes.
    useEffect(() => {
        sessionStorage.setItem("token", token)
    }, [token])


    const login = (user, pass) => {
        console.log('Logging in ', user, pass);
        fetch(apiUriBase + 'auth/v1/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: user,
                password: pass,
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('http error: ' + response.statusCode)
                }
                return response.json()
            })
            .then(data => {
                // console.log('data ', data);
                setToken(data.token);
                setLogged(true);
                setUsername(user);
                setNextPage(apiUriBase + 'v1/items/sale/' + data.token)
                setLoginFailed(false);
            })
            .catch((err) => {
                console.log("Error ", err);
                setUsername('');
                setToken('');
                setLogged(false);
                setLoginFailed(true);
            })
    }


    //--------------------- LOGGING OUT --------------------------
    const logout = () => {
        setToken('');
        setUsername('');
        setLogged(false);
        setBasketList([]);
        setNextPage(apiUri)
    }

    //--------------------- REFRESH ITEMS --------------------------
    const refreshItems = useCallback(() => {
        setAvailableItems([]);
        if (logged) {
            if (searchText !== '') {
                setNextPage(apiUriBase + 'v1/items/sale/' + token + '/' + searchText);
                loadMore(apiUriBase + 'v1/items/sale/' + token + '/' + searchText);
            } else {
                setNextPage(apiUriBase + 'v1/items/sale/' + token)
                loadMore(apiUriBase + 'v1/items/sale/' + token);

            }
        } else {
            if (searchText !== '') {
                setNextPage(apiUri + '/' + searchText)
                loadMore(apiUri + '/' + searchText);

            } else {
                setNextPage(apiUri)
                loadMore(apiUri);

            }
        }
    }, [searchText, token, logged, apiUri])

    useEffect(() => {
        refreshItems()
    }, [refreshItems])

    //--------------------- LOADING MORE ITEMS --------------------------
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [nextPage, setNextPage] = useState(apiUri);

    const loadMore = (page) => {
        //api get next page
        setLoading(true);
        setError('');

        fetch(page)
            .then(response => {
                if (!response.ok) {
                    throw new Error(' Error in request');
                }
                return response.json();
            })
            .then((data) => {
                // console.log('Data: ', data, data.count, data.next, data.prev, data.results);
                setLoading(false);
                setAvailableItems((prevItems) => [...prevItems, ...data.results]);
                setTotalItems(data.count);
                //update next page
                setNextPage(data.next);
            })
            .catch(err => {
                console.log('ERROR: ', err.name, err.message);
                setLoading(false);
                if (err.name === 'Custom error') setError(err.name + err.message + err.responsem.statusText)
                else setError(err.name + err.message);
            })
    }


    //--------------------- RETURN --------------------------

    return (
        <div className='App'>
            <div className='header'>
                <div className='shop'>
                    <img className='logo'
                         src={logoImg}
                         height={90}
                         width={90}
                         alt="Shop's Logo"/>
                    <div className='webshopName'>Webshop</div>
                </div>

                <Basket itemList={basketList}
                        removeItemHandler={removeItemClick}
                        removeAllHandler={removeAllClick}
                        loggedIn={logged}
                        refreshItems={refreshItems}
                        addItemBasket={addItemClick}
                        token={token}
                        setBasketList={setBasketList}></Basket>

            </div>

            <BrowserRouter>
                <div className={'menu'}>
                    <NavLink className={'menu-item'} to={'/shop'}>Shop</NavLink>
                    {!logged && <NavLink className={'menu-item'} to={'/signup'}>Sign up</NavLink>}
                    {!logged && <NavLink className={'menu-item'} to={'/login'}>Log in</NavLink>}
                    {logged && <NavLink className={'menu-item'} to={'/myitems'}>My items</NavLink>}
                    {logged && <NavLink className={'menu-item'} to={'/account'}>My account</NavLink>}
                    {logged && <label className={'menu-item'} onClick={logout}>Log out</label>}
                </div>

                <Routes>
                    <Route path='/shop'
                           element={<ItemsContainer loadMoreHandler={() => loadMore(nextPage)}
                                                    availableItems={availableItemsList}
                                                    totalNumberItems={totalItems} next={nextPage} loading={loading}
                                                    error={error}
                                                    setSearchText={setSearchText}
                                                    searchText={searchText}/>}/>
                    <Route path='/login'
                           element={<InputFormLogIn text={'Log in'} login={login} loggedIn={logged} loginFailed={loginFailed}/>}/>
                    <Route path='/signup'
                           element={<InputFormRegister text={'Sign up'} loggedIn={logged}></InputFormRegister>}/>
                    <Route path='/myitems'
                           element={<MyItems loggedIn={logged} token={token} username={username}></MyItems>}/>
                    <Route path='/account'
                           element={<Account loggedIn={logged} token={token} username={username}/>}/>
                    <Route path='*' element={<p>There's nothing here: 404!</p>}/>
                </Routes>
            </BrowserRouter>

        </div>

    );
}

export default App;
