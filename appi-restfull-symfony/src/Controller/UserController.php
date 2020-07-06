<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Validator\Validation;
use App\Entity\User;
use App\Entity\Video;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Constraints\Email;
use App\Services\JwtAuth;

class UserController extends AbstractController
{

    public function resJson($data){

        // Serializar datos con servicio serealizer
        $json = $this->get('serializer')->serialize($data, 'json');

        // Response con httpfoundation
        $response = new response();

        // Asignar contenido a la respuesta.
        $response->setContent($json);

        // Indicar formato de respuesta.
        $response->headers->set('Content-Type', 'application/json');

        // Devolver respuesta
        return $response;

    }

    public function index($id)
    {
        $user_repo = $this->getDoctrine()->getRepository(User::class);

        $user = $user_repo->findOneBy([
            'id' => $id
        ]);
        if(is_object($user)){
            $data = array(
                'status' => 'success',
                'code' => 200,
                'user' => $user
            );
        }else{
            $data = array(
                'status' => 'error',
                'code' => 400,
                'message' => 'El usuario no existe'
            );
        }
        
        return $this->resJson($data);
    }

    public function register(Request $request)
    {
        // Recoger los datos por post
        $json = $request->get('json', null); 

        // Decodificar el json
        $params = json_decode($json);
        $params_array = json_decode($json, true);
        // Validar datos
        if(!empty($params)){

            $name = (!empty($params->name)) ? $params->name : 'null';
            $surname = (!empty($params->surname)) ? $params->surname : 'null';
            $email = (!empty($params->email)) ? $params->email : 'null';
            $password = (!empty($params->password)) ? $params->password : 'null';

            $validate = Validation::createValidator();
            $validate_email = $validate->validate($email, [
                new Email()
            ]);
            if(!empty($email) && count($validate_email) == 0 && !empty($password) && !empty($name) && !empty($surname)){
                // cifrar la contrasen
                $pwh = hash('sha256', $password);
                // validacion ok crear el usuario
                $user = new User();
                $user->setName($name);
                $user->setSurname($surname);
                $user->setEmail($email);
                $user->setPassword($pwh);  
                $user->setRole('ROLE_USER');   
                $user->setCreatedAt(new \Datetime('now'));
                $user->setUpdateAt(new \Datetime('now'));
                
                // Validar que el usuario no exita, y crear el usuario.
                $doctrine = $this->getDoctrine();
                $em = $doctrine->getManager();
                $user_repo = $doctrine->getRepository(User::class);
                $is_isset = $user_repo->findBy(array('email' => $email));
                
                if(count($is_isset) === 0){
                    $em->persist($user);
                    $em->flush();
                    $data = array(
                        'status' => 'success',
                        'code'  => 200,
                        'message' => 'El usuario se ha creado correctamente',
                        'user' => $user
                    );
                }else{
                    $data = array(
                        'status' => 'error',
                        'code'  => 400,
                        'message' => 'El usuario ya existe'
                    );
                }
            }else{
                $data = array(
                    'status' => 'error',
                    'code'  => 400,
                    'message' => 'El usuario no se ha creado'
                );
            }
        }else{
             // response default
             $data = array(
                'status' => 'error',
                'code'  => 400,
                'message' => 'Datos enviados invalidos'
            );
        }
       
        return new JsonResponse($data);
    }

    public function login(Request $request, JwtAuth $jwt_auth){

        // Recibir los datos del login por post
        $json = $request->get('json', null);
        // Array decodificado.
        $params = json_decode($json);
        $params_array = json_decode($json, true); 

        $signup = array(
            'status' => 'error',
            'code' => 400,
            'message' => 'Datos incorrectos'
        );
        
        // Comprobar y validar datos
        if(!empty($params_array)){     
            $email = (!empty($params_array['email'])) ? $params_array['email'] : null;
            $password = (!empty($params_array['password'])) ? $params_array['password']: null;
            $getToken = (!empty($params_array['getToken'])) ? $params_array['getToken']: null;
            // Validation data.
            $validate = Validation::createValidator();
            $validate_email = $validate->validate($email, [
                new Email()
            ]);
            if(!empty($email) && !empty($password) && count($validate_email) == 0){

                // Cifrar contrasena
                $pwh = hash('sha256', $password);
                // Llamar servicio jwt, token                
                if($getToken){
                    $signup = $jwt_auth->signup($email, $pwh, $getToken);
                }else{
                    $signup = $jwt_auth->signup($email, $pwh);
                }          
            }   
        }      
        return new JsonResponse($signup);
    }   

    public function update (Request $request, JwtAuth $jwt_auth){
        // Recoger cabecero de autenticacion
        $token = $request->headers->get('Authorization');
        // Recoger datos por post
        $json = $request->get('json', null);
        $params = json_decode($json);
        $params_array = json_decode($json, true);
        // Crear metodo para comprobar token correcto
        $authCheck =  $jwt_auth->checkToken($token);
        $data = array(
            'status' => 'error',
            'code' => 400,
            'message' => 'Usuario no identificado'
        );
        // Si es correcto, hacer actualizacion de usuario
        if($authCheck && !empty($params)){
            // Conseguir entity manager.
            $em = $this->getDoctrine()->getManager();
            // Conseguir los datos del usuario identificado.
            $identity = $jwt_auth->checkToken($token, true);
            // Conseguir el usuario a actualizar.
            $user_repo = $this->getDoctrine()->getRepository(User::class);
            $user = $user_repo->findOneBy([
                'id' => $identity->sub
            ]);
            // Validaciones de datos            
            $email = (!empty($params->email)) ? $params->email : 'null';           
            // Validation data.
            $validate = Validation::createValidator();
            $validate_email = $validate->validate($email, [
                new Email()
            ]);                        
            if(is_object($user)  && count($validate_email) == 0){                                                

                // Asignar nuevos datos al objeto
                $user->setName($params->name);
                $user->setSurname($params->surname);
                $user->setEmail($params->email); 
                $user->setDescription($params->description) ? $params->description : null;     
                $user->setImage($params->image);  
                
                // Comprobar duplicados.
                $is_isset = $user_repo->findBy(array('email' => $email));
                if(count($is_isset) == 0 || $identity->email == $email){
                    // Guardar datos actualizados.
                    $em->persist($user);
                    $em->flush();

                    $data = array(
                        'status' => 'success',
                        'code' => 200,
                        'message' => 'Usuario actualizado',
                        'changes' => $user
                    ); 
                }else{
                    $data = array(
                        'status' => 'error',
                        'code' => 400,
                        'message' => 'El email ya existe'
                    );
                }
            }                      
        }        

        return new JsonResponse($data);
    }

}
