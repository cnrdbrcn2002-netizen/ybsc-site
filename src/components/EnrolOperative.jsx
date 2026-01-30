// import { auth, db } from '../config/firebase';
// import { createUserWithEmailAndPassword } from 'firebase/auth'; // Not needed since we use Google Auth for user creation
import { db, auth } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const EnrolOperative = ({ onEnrolSuccess, onCancel }) => {
    const [form, setForm] = useState({
        idName: '',
        passcode: '',
        role: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!/^\d{6}$/.test(form.passcode)) {
            setError('CRITICAL: PASSCODE MUST BE 6 DIGITS');
            setLoading(false);
            return;
        }

        try {
            const user = auth.currentUser;
            if (!user) throw new Error("NO_AUTH_TOKEN_DETECTED");

            const operativeData = {
                idName: form.idName.toUpperCase(),
                passcode: form.passcode,
                role: form.role.toUpperCase(),
                email: user.email,
                photoURL: user.photoURL || null,
                mahlukatLevel: 1, // Start at level 1
                status: 'ACTIVE',
                joinedAt: serverTimestamp()
            };

            await setDoc(doc(db, "operatives", user.uid), operativeData);

            console.log("Dossier Created Successfully");
            if (onEnrolSuccess) onEnrolSuccess(); // Close modal, context listener will handle the rest

        } catch (err) {
            console.error("Enrolment Error:", err);

            // LocalStorage Fallback for Permission Denied
            if (err.code === 'permission-denied' || err.message.includes('permission-denied')) {
                const fallbackUser = {
                    idName: form.idName.toUpperCase(),
                    passcode: form.passcode,
                    role: form.role.toUpperCase(),
                    email: auth.currentUser?.email || "offline_user@ybsc.com",
                    photoURL: auth.currentUser?.photoURL || null,
                    mahlukatLevel: 1,
                    status: 'ACTIVE (OFFLINE_MODE)',
                    joinedAt: new Date().toISOString()
                };

                localStorage.setItem('operative_data', JSON.stringify(fallbackUser));
                console.log("OFFLINE_ENROLMENT_COMPLETE");
                if (onEnrolSuccess) onEnrolSuccess(fallbackUser); // Pass user data back
                return;
            }

            setError(`SYSTEM_ERROR: ${err.message}`);
            setLoading(false);
        }
    };

    return (
        <div className="enrol-container">
            <div className="scanlines"></div>

            <div className="enrol-header">
                <h2>ENROL_OPERATIVE</h2>
                <div className="status-blink">DATABASE_STATUS: CONNECTED_TO_FIREBASE</div>
            </div>

            <form onSubmit={handleSubmit} className="enrol-form">
                <div className="input-group">
                    <label>ID_NAME</label>
                    <input
                        type="text"
                        placeholder="EX: GHOST_01"
                        value={form.idName}
                        onChange={(e) => setForm({ ...form, idName: e.target.value })}
                        required
                    />
                </div>

                <div className="input-group">
                    <label>SECRET_PASSCODE (6-DIGIT)</label>
                    <input
                        type="password"
                        placeholder="******"
                        maxLength="6"
                        value={form.passcode}
                        onChange={(e) => setForm({ ...form, passcode: e.target.value })}
                        required
                    />
                </div>

                <div className="input-group">
                    <label>ROLE</label>
                    <input
                        type="text"
                        placeholder="EX: DRIVER / MECHANIC"
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        required
                    />
                </div>

                {/* Fake Image Upload */}
                <div className="input-group locked">
                    <label>OPERATIVE_IMG</label>
                    <div className="fake-upload">
                        [LOCKED] Awaiting Founder Image Upload
                    </div>
                </div>

                {error && <div className="error-msg">&gt;&gt; {error}</div>}

                <div className="action-row">
                    <button type="button" className="cancel-btn" onClick={onCancel}>ABORT</button>
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'ENCRYPTING...' : 'INITIATE_HANDSHAKE'}
                    </button>
                </div>
            </form>

            <style>{`
                .enrol-container {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: #050505;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    z-index: 500;
                    color: white;
                    font-family: var(--font-tech);
                }
                .scanlines {
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px);
                    pointer-events: none;
                }
                .enrol-header {
                    text-align: center;
                    margin-bottom: 40px;
                    z-index: 2;
                }
                .enrol-header h2 {
                    font-family: var(--font-main);
                    font-size: 3rem;
                    color: transparent;
                    -webkit-text-stroke: 1px white;
                    margin: 0 0 10px 0;
                    letter-spacing: 5px;
                }
                .status-blink {
                    color: var(--color-red);
                    font-size: 0.8rem;
                    animation: blink 2s infinite;
                }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

                .enrol-form {
                    width: 100%;
                    max-width: 400px;
                    z-index: 2;
                    background: rgba(0,0,0,0.8);
                    padding: 30px;
                    border: 1px solid #333;
                }
                .input-group {
                    margin-bottom: 25px;
                }
                .input-group label {
                    display: block;
                    font-size: 0.7rem;
                    color: #777;
                    margin-bottom: 5px;
                    letter-spacing: 2px;
                }
                .input-group input {
                    width: 100%;
                    background: black;
                    border: 1px solid #333;
                    padding: 15px;
                    color: white;
                    font-family: var(--font-tech);
                    font-size: 1rem;
                    transition: all 0.3s;
                }
                .input-group input:focus {
                    outline: none;
                    border-color: var(--color-red);
                    box-shadow: 0 0 15px rgba(255, 0, 51, 0.2);
                }
                .input-group.locked .fake-upload {
                    border: 1px dashed #333;
                    padding: 15px;
                    color: #444;
                    font-size: 0.8rem;
                    text-align: center;
                    cursor: not-allowed;
                }
                .action-row {
                    display: flex;
                    gap: 20px;
                    margin-top: 40px;
                }
                button {
                    flex: 1;
                    padding: 15px;
                    font-family: var(--font-main);
                    font-weight: 800;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-size: 0.9rem;
                    letter-spacing: 1px;
                }
                .cancel-btn {
                    background: #222;
                    color: #777;
                }
                .cancel-btn:hover {
                    background: #333;
                    color: white;
                }
                .submit-btn {
                    background: var(--color-red);
                    color: black;
                }
                .submit-btn:hover:not(:disabled) {
                    box-shadow: 0 0 20px var(--color-red);
                    transform: translateY(-2px);
                }
                .submit-btn:disabled {
                    opacity: 0.5;
                    cursor: wait;
                }
                .error-msg {
                    color: var(--color-red);
                    font-size: 0.8rem;
                    margin-top: 10px;
                    animation: shake 0.3s;
                }
            `}</style>
        </div>
    );
};

export default EnrolOperative;
