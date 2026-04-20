const register = async (data) => {
  try {
    const normalizedRole = data?.role === 'ca' ? 'ca' : 'user';

    const payload = {
      ...data,
      role: normalizedRole,
      userType:
        data?.userType || (normalizedRole === 'ca' ? 'professional' : 'user'),
    };

    console.log(
      'AUTH REGISTER REQUEST:',
      JSON.stringify(payload, null, 2)
    );

    const res = await authAPI.register(payload);

    console.log(
      'AUTH REGISTER RAW RESPONSE:',
      JSON.stringify(res?.data || null, null, 2)
    );

    const authUser = res?.data?.user;
    const authToken = res?.data?.token;
    const success = !!res?.data?.success;

    if (!success) {
      throw new Error(res?.data?.message || 'Unable to create account');
    }

    if (!authToken || !authUser) {
      throw new Error('Registration succeeded but user/token missing');
    }

    await SecureStore.setItemAsync(TOKEN_KEY, authToken);
    setToken(authToken);

    let backendUser = authUser;

    try {
      const meResponse = await authAPI.getMe();
      console.log(
        'AUTH REGISTER GETME RESPONSE:',
        JSON.stringify(meResponse?.data || null, null, 2)
      );

      backendUser =
        meResponse?.data?.user ||
        meResponse?.data?.data ||
        authUser ||
        null;
    } catch (meError) {
      console.log(
        'AUTH REGISTER GETME ERROR:',
        JSON.stringify(
          meError?.response?.data || meError?.message || null,
          null,
          2
        )
      );
    }

    const resolvedUser = {
      ...(backendUser || authUser),
      role: (backendUser || authUser)?.role || normalizedRole,
      userType:
        (backendUser || authUser)?.userType ||
        payload.userType ||
        (normalizedRole === 'ca' ? 'professional' : 'user'),
    };

    await persistAuth(resolvedUser, authToken);

    return {
      success: true,
      token: authToken,
      user: buildUser(resolvedUser),
    };
  } catch (err) {
    console.log(
      'AUTH REGISTER ERROR RESPONSE:',
      JSON.stringify(err?.response?.data || null, null, 2)
    );
    console.log('AUTH REGISTER ERROR MESSAGE:', err?.message);
    console.log(
      'AUTH REGISTER ERROR FULL:',
      JSON.stringify(
        {
          message: err?.message,
          status: err?.response?.status,
          data: err?.response?.data,
        },
        null,
        2
      )
    );

    throw new Error(
      err?.response?.data?.errors?.[0]?.message ||
        err?.response?.data?.message ||
        err?.message ||
        'Unable to create account'
    );
  }
};