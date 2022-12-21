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

    const [availableItems, setAvailableItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    let availableItemsList = [];
    const [basketList, setBasketList] = useState(() => {
        if (localStorage.basketList) return JSON.parse(localStorage.getItem("basketList"));
        else return [];

    });
    const [logged, setLogged] = useState(false);
    const [username, setUsername] = useState(() => {
        // this function is needed if we want to use local storage
        if (localStorage.username) {
            return localStorage.getItem("username");
        } else return ''
    });

    const [searchText, setSearchText] = useState('')


    const addItemClick = (item) => {
        // console.log(item);
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

    const removeAllClick = () => {
        setBasketList([]);
    }

    const removeItemClick = (itemId) => {
        setBasketList((prevState) => {
            return prevState.filter((id, idx) => idx !== itemId)
        })
    }

    //using local storage to store the basket whenever it changes.
    useEffect(() => {
        localStorage.setItem("basketList", JSON.stringify(basketList))
    }, [basketList])

    //using local storage to store the username whenever it changes.
    useEffect(() => {
        localStorage.setItem("username", username)
    }, [username])


    useEffect(() => {
        console.log('App changed');
        document.title = 'Webshop';
    }, [])


    // const updateItemsBasket = (updatedList) => {
    //     setBasketList(updatedList);
    //     console.log(updatedList)
    //     refreshItems(logged);
    // }


    //--------------------- LOGGING IN --------------------------

    const [token, setToken] = useState(() => {
        // this function is needed if we want to use local storage
        if (localStorage.token) {
            if (localStorage.getItem("token") !== "\"\"") {
                setLogged(true);
            }
            return localStorage.getItem("token");
        } else return '';
    });

    //using local storage to store the token whenever it changes.
    useEffect(() => {
        localStorage.setItem("token", token)
    }, [token])


    const login = (user, pass) => {
        console.log('Logging in ', user, pass);
        fetch(' http://127.0.0.1:8000/api/auth/v1/login/', {
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
                setNextPage('http://127.0.0.1:8000/api/v1/items/sale/' + data.token)
            })
            .catch((err) => {
                console.log("Error ", err);
                setUsername('');
                setToken('');
                setLogged(false);
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
                setNextPage('http://127.0.0.1:8000/api/v1/items/sale/' + token + '/' + searchText);
                loadMore('http://127.0.0.1:8000/api/v1/items/sale/' + token + '/' + searchText);
                console.log("items with search bar & logged")
            } else {
                setNextPage('http://127.0.0.1:8000/api/v1/items/sale/' + token)
                loadMore('http://127.0.0.1:8000/api/v1/items/sale/' + token);
                console.log("items with NO search bar & logged")

            }
        } else {
            if (searchText !== '') {
                setNextPage(apiUri + '/' + searchText)
                loadMore(apiUri + '/' + searchText);
                console.log("items with search bar & NOT logged")

            } else {
                setNextPage(apiUri)
                loadMore(apiUri);
                console.log("items with NO search bar & NOT logged")

            }
        }
    }, [searchText, token, logged])

    useEffect(() => {
        refreshItems()
        console.log('useEffect: refreshItems done')
    }, [refreshItems])

    //--------------------- MODIFY AN ITEM IN BASKET --------------------------

    const modifyItemBasket = (item, idx) => {
        setBasketList([...basketList.slice(0, idx), item, ...basketList.slice(idx + 1)])
    }


    //--------------------- LOADING MORE ITEMS --------------------------

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const apiUri = 'http://127.0.0.1:8000/api/v1/items';
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
                        modifyItemBasket={modifyItemBasket}
                        token={token}></Basket>

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
                           element={<InputFormLogIn text={'Log in'} login={login} loggedIn={logged}></InputFormLogIn>}/>
                    <Route path='/signup'
                           element={<InputFormRegister text={'Sign up'}></InputFormRegister>}/>
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
